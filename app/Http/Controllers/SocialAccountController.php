<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SocialAccount;

class SocialAccountController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return response()->json($user->socialAccounts);
    }
}
