<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
        // For phase 1, just return all comments from the user's social accounts
        $user = auth()->user();
        
        $comments = Comment::whereHas('socialAccount', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })->latest('timestamp')->get();

        return response()->json($comments);
    }

    public function toggleHide(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        
        // Ensure user owns this comment
        if ($comment->socialAccount->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->is_hidden = !$comment->is_hidden;
        $comment->action = $comment->is_hidden ? 'HIDE' : 'ALLOW';
        $comment->save();

        return response()->json(['message' => 'Status updated', 'comment' => $comment]);
    }
}
