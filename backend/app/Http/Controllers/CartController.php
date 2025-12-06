<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        return response()->json(Cart::all());
    }

    public function store(Request $request)
    {
        $cartItem = Cart::updateOrCreate(
            ['product_id' => $request->product_id],
            [
                'product_name' => $request->name,
                'price' => $request->price,
                'quantity' => $request->quantity,
                'image' => $request->image
            ]
        );
        return response()->json($cartItem, 201);
    }

    public function update(Request $request, $id)
    {
        $cartItem = Cart::findOrFail($id);
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        return response()->json($cartItem);
    }

    public function destroy($id)
    {
        Cart::destroy($id);
        return response()->json(['message' => 'Item removed']);
    }
}
