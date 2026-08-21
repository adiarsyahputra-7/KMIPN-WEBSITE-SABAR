<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
        $comments = auth()->user()->comments()->latest('timestamp')->get();
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
