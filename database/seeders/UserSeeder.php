<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\SocialAccount;
use App\Models\Comment;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Kalyca Admin
        $kalyca = User::create([
            'name' => 'Kalyca Admin',
            'email' => 'kalyca@sabar.com',
            'password' => Hash::make('password'),
            'role' => 'admin_agensi',
            'plan' => 'Agency Pro',
        ]);

        // 2. Create Adiar Creator
        $adiar = User::create([
            'name' => 'Adiar Creator',
            'email' => 'adiar@sabar.com',
            'password' => Hash::make('password'),
            'role' => 'creator',
            'plan' => 'Creator Pro',
        ]);

        // 3. Create Social Accounts for Adiar
        $igAccount = SocialAccount::create([
            'user_id' => $adiar->id,
            'platform' => 'instagram',
            'handle' => '@adiarsyahputra',
            'followers_count' => 12500,
        ]);

        $tiktokAccount = SocialAccount::create([
            'user_id' => $adiar->id,
            'platform' => 'tiktok',
            'handle' => '@adiar_tiktok',
            'followers_count' => 45000,
        ]);

        // 4. Create Comments for IG Account
        Comment::create([
            'social_account_id' => $igAccount->id,
            'author' => 'hater_no_1',
            'text' => 'Konten lo sampah banget sih, mending berhenti aja',
            'sentiment' => 'NEGATIF',
            'toxicity_score' => 0.95,
            'severity' => 8,
            'action' => 'HIDE',
            'is_hidden' => true,
        ]);

        Comment::create([
            'social_account_id' => $igAccount->id,
            'author' => 'fans_setia',
            'text' => 'Keren banget bang! Ditunggu konten selanjutnya',
            'sentiment' => 'POSITIF',
            'toxicity_score' => 0.05,
            'severity' => 1,
            'action' => 'ALLOW',
            'is_hidden' => false,
        ]);
    }
}
