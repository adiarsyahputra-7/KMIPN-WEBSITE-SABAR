<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GeminiService
{
    protected ?string $apiKey;
    protected string $model;
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->model = config('services.gemini.model', 'gemini-1.5-flash');
        $this->apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";
    }

    /**
     * Menganalisis komentar menggunakan Google Gemini API.
     * Menggunakan auto-fallback ke analisis rule-based jika terjadi kegagalan API.
     *
     * @param string $text
     * @return array{sentiment: string, toxicity_score: float, severity: int, is_sarcasm: bool, action: string, reason: string}
     */
    public function analyzeComment(string $text): array
    {
        // ── 1. Jika API Key tidak diset, gunakan Fallback ────────────────────
        if (empty($this->apiKey)) {
            Log::warning('Gemini API: GEMINI_API_KEY is empty. Falling back to rule-based analysis.');
            return $this->fallbackAnalysis($text, 'API Key kosong (mode fallback)');
        }

        try {
            // ── 2. Request ke Google Gemini API dengan JSON Mode & Schema ────────
            $systemInstruction = $this->getSystemInstruction();

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}?key={$this->apiKey}", [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $text]
                        ]
                    ]
                ],
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $systemInstruction]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'sentiment' => [
                                'type' => 'STRING',
                                'enum' => ['POSITIF', 'NEGATIF', 'NETRAL']
                            ],
                            'toxicity_score' => [
                                'type' => 'NUMBER'
                            ],
                            'is_sarcasm' => [
                                'type' => 'BOOLEAN'
                            ],
                            'severity' => [
                                'type' => 'INTEGER'
                            ],
                            'action' => [
                                'type' => 'STRING',
                                'enum' => ['ALLOW', 'HIDE']
                            ],
                            'reason' => [
                                'type' => 'STRING'
                            ]
                        ],
                        'required' => ['sentiment', 'toxicity_score', 'is_sarcasm', 'severity', 'action', 'reason']
                    ]
                ]
            ]);

            // ── 3. Tangani kegagalan HTTP Response ───────────────────────────────
            if ($response->failed()) {
                Log::error('Gemini API request failed', [
                    'status' => $response->status(),
                    'error' => $response->json(),
                ]);
                return $this->fallbackAnalysis($text, 'Koneksi API Gagal');
            }

            // ── 4. Parse output JSON dari Gemini ────────────────────────────────
            $candidate = $response->json('candidates.0.content.parts.0.text');

            if (empty($candidate)) {
                Log::warning('Gemini API returned empty text response', ['raw' => $response->json()]);
                return $this->fallbackAnalysis($text, 'Format respons kosong');
            }

            $result = json_decode($candidate, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::warning('Gemini API returned invalid JSON', ['raw_text' => $candidate]);
                return $this->fallbackAnalysis($text, 'Format JSON salah');
            }

            // Normalisasi data keluaran
            return [
                'sentiment'      => strtoupper($result['sentiment'] ?? 'NETRAL'),
                'toxicity_score' => (float) ($result['toxicity_score'] ?? 0.0),
                'severity'       => (int) ($result['severity'] ?? 1),
                'is_sarcasm'     => (bool) ($result['is_sarcasm'] ?? false),
                'action'         => strtoupper($result['action'] ?? 'ALLOW'),
                'reason'         => $result['reason'] ?? 'Dianalisis menggunakan Gemini AI.',
            ];

        } catch (Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            return $this->fallbackAnalysis($text, 'Exception: ' . $e->getMessage());
        }
    }

    /**
     * System Instruction untuk melatih Gemini agar menjadi moderator Bahasa Indonesia yang cerdas.
     */
    protected function getSystemInstruction(): string
    {
        return "Anda adalah asisten moderasi konten media sosial profesional (SABAR) yang ahli dalam menyaring komentar Bahasa Indonesia.\n"
            . "Tugas utama Anda adalah mendeteksi komentar negatif, toksik, tidak pantas, perundungan, pornografi, ujaran kebencian, SARA, spam, serta sarkasme.\n\n"
            . "ATURAN DETEKSI KHUSUS:\n"
            . "1. DETEKSI LEET SPEAK & OBFUSCATION:\n"
            . "   Pengguna internet sering menyamarkan kata kasar menggunakan angka (misal: '0' untuk 'o', '3' untuk 'e', '4' untuk 'a', '5' untuk 's', '1' untuk 'i') atau menyisipkan simbol bintang/karakter acak (misal: 'a*j*ng', 't0l0l', 'b3g0', 'g0bl0k', '5ampah', 'b4ngs4t'). Anda HARUS menerjemahkan kata-kata tersembunyi/tersamar ini ke kata kasar aslinya terlebih dahulu sebelum menentukan sentimen dan aksi.\n"
            . "2. DETEKSI SARKASME:\n"
            . "   Komentar sindiran halus yang bernada mengejek atau pujian palsu (misal: \"Hebat banget kerjanya, jadi hancur semua\") harus dikategorikan sebagai NEGATIF dan action: HIDE.\n"
            . "3. KATEGORI SENTIMEN:\n"
            . "   - \"POSITIF\": Dukungan, pujian tulus, doa baik, apresiasi.\n"
            . "   - \"NETRAL\": Pertanyaan biasa, pernyataan fakta tanpa emosi negatif/positif.\n"
            . "   - \"NEGATIF\": Mengandung kata kasar (termasuk yang disamarkan), ujaran kebencian, pelecehan, spam iklan judi/pornografi, sarkasme sindiran.\n"
            . "4. ACTION:\n"
            . "   - \"ALLOW\": Untuk sentimen POSITIF atau NETRAL.\n"
            . "   - \"HIDE\": Untuk sentimen NEGATIF (termasuk sarkasme dan kata kasar tersamar).\n"
            . "5. REASON:\n"
            . "   Berikan alasan singkat dalam bahasa Indonesia yang menerangkan keputusan Anda (maksimal 100 karakter). Contoh: \"Menggunakan kata kasar tersamar ('b3g0')\" atau \"Sindiran halus (sarkasme)\".";
    }

    /**
     * Fallback analisis sederhana berbasis pencocokan pola jika API Gemini bermasalah.
     */
    protected function fallbackAnalysis(string $text, string $fallbackReason): array
    {
        $lower = mb_strtolower($text);

        // Pola sarkasme umum
        $sarcasmPatterns = [
            'keren tapi', 'bagus banget sampai', 'kayak siput', 'hebat banget ya',
            'mantap banget ya', 'bagus sih tapi', 'luar biasa padahal',
        ];
        $isSarcasm = collect($sarcasmPatterns)->some(fn($p) => str_contains($lower, $p));

        // Kata-kata toksik umum + leet speak sederhana
        $toxicPatterns = [
            'sampah', 'bego', 'jijik', 'caper', 'mati', 'mundur aja', 'gak guna',
            'gak pantes', 'anjing', 'bangsat', 'tolol', 'idiot', 'bodoh', 'goblok',
            'dungu', 'najis', 'kampungan', 'norak',
            // Leet speak sederhana
            'b3g0', 't0l0l', 'g0bl0k', '5ampah', 'b4ngs4t', 'a*j*ng', 'anji*g'
        ];
        $hasToxic = collect($toxicPatterns)->some(fn($p) => str_contains($lower, $p));

        // Kata-kata positif umum
        $positivePatterns = [
            'bagus', 'terima kasih', 'suka banget', 'menginspirasi', 'keren parah',
            'sukses terus', 'mantap', 'luar biasa', 'semangat', 'keren', 'hebat',
            'top', 'the best', 'terbaik',
        ];
        $hasPositive = collect($positivePatterns)->some(fn($p) => str_contains($lower, $p));

        if ($hasToxic || $isSarcasm) {
            return [
                'sentiment'      => 'NEGATIF',
                'toxicity_score' => $isSarcasm ? 0.82 : 0.95,
                'severity'       => $isSarcasm ? 8 : 9,
                'is_sarcasm'     => $isSarcasm,
                'action'         => 'HIDE',
                'reason'         => "Rule-based: Terdeteksi kata kasar/sarkasme. ({$fallbackReason})",
            ];
        }

        if ($hasPositive) {
            return [
                'sentiment'      => 'POSITIF',
                'toxicity_score' => 0.02,
                'severity'       => 1,
                'is_sarcasm'     => false,
                'action'         => 'ALLOW',
                'reason' => "Rule-based: Komentar positif. ({$fallbackReason})",
            ];
        }

        return [
            'sentiment'      => 'NETRAL',
            'toxicity_score' => 0.10,
            'severity'       => 2,
            'is_sarcasm'     => false,
            'action'         => 'ALLOW',
            'reason'         => "Rule-based: Komentar netral. ({$fallbackReason})",
        ];
    }
}
