<?php

namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index() {
        return Order::with('items.product')->get();
    }

    public function show($id) {
        return Order::with('items.product')->findOrFail($id);
    }

    public function store(Request $request)
{
    // Validate incoming request
    $request->validate([
        'customer_name' => 'required|string|max:255',
        'address' => 'required|string|max:500',
        'contact_number' => 'required|string|max:20',
        'payment_method' => 'required|string',
        'total' => 'required|numeric|min:0',
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|integer|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric|min:0',
    ]);

    try {
        // Create the order
        $order = Order::create([
            'customer_name' => $request->customer_name,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'payment_method' => $request->payment_method,
            'total' => $request->total,
            'status' => 'pending',
        ]);

        // Create the order items
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        // Optional: eager load product relation for frontend
        $order->load('items.product');

        return response()->json($order, 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to place order',
            'message' => $e->getMessage(),
        ], 500);
    }
}



    public function update(Request $request, $id) {
        $order = Order::findOrFail($id);
        $order->update($request->all());
        return response()->json($order);
    }

    public function destroy($id) {
        Order::destroy($id);
        return response()->json(null, 204);
    }

    public function clear()
    {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\OrderItem::truncate();
        \App\Models\Order::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return response()->json(['message' => 'All orders deleted']);
    }


}
