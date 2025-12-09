<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Get all orders with items and products
    public function index()
    {
        return Order::with('items.product')->get();
    }

    // Get a single order
    public function show($id)
    {
        return Order::with('items.product')->findOrFail($id);
    }

    // Create a new order
    public function store(Request $request)
    {
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

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'payment_method' => $request->payment_method,
                'total' => $request->total,
                'status' => 'pending',
            ]);

            // Create order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            $order->load('items.product'); // eager load for frontend

            return response()->json($order, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to place order',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Update an order
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->only(['status', 'total', 'payment_method'])); // update only allowed fields
        return response()->json($order);
    }

    // Delete a single order
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->items()->delete(); // delete related items first
        $order->delete();

        return response()->json(null, 204);
    }

    // Clear all orders
    public function clear()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        OrderItem::truncate();
        Order::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return response()->json(['message' => 'All orders deleted']);
    }
}
