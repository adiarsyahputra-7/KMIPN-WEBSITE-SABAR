<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('social_account_id')->constrained()->onDelete('cascade');
            $table->string('platform_comment_id')->nullable();
            $table->string('author');
            $table->string('avatar')->nullable();
            $table->string('post_title')->nullable();
            $table->text('text');
            $table->string('sentiment')->default('NETRAL');
            $table->float('toxicity_score')->default(0);
            $table->integer('severity')->default(1);
            $table->boolean('is_sarcasm')->default(false);
            $table->string('action')->default('ALLOW');
            $table->boolean('is_hidden')->default(false);
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
