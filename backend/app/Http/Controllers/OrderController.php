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

    public function store(Request $request) {
        $order = Order::create([
            'user_id' => $request->user_id ?? null,
            'total' => $request->total,
            'status' => 'pending'
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }

        return response()->json($order->load('items.product'), 201);
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
}
