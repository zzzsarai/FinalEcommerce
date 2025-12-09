<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Get all cart items
    public function index()
    {
        return response()->json(Cart::all());
    }

    // Add or update item in cart
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'product_name' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer|min:1',
            'image' => 'nullable|string',
        ]);

        $cartItem = Cart::updateOrCreate(
            ['product_id' => $request->product_id],
            $request->only(['product_name', 'price', 'quantity', 'image'])
        );

        return response()->json($cartItem, 201);
    }

    // Update quantity of a cart item
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::findOrFail($id);
        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json($cartItem);
    }

    // Remove item from cart
    public function destroy($id)
    {
        Cart::destroy($id);
        return response()->json(['message' => 'Item removed']);
    }

    // Clear all items from cart
    public function clear()
    {
        Cart::truncate(); // delete all rows
        return response()->json(['message' => 'Cart cleared']);
    }
}
