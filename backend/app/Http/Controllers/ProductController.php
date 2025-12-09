<?php

namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index() {
        return Product::all();
    }

    public function show($id) {
        return Product::findOrFail($id);
    }

    public function store(Request $request) {
        $product = new Product();
        $product->name = $request->input('name');
        $product->description = $request->input('description');
        $product->price = $request->input('price');

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/donuts'), $imageName);
            $product->image = $imageName;
        }

        $product->save();
        return response()->json($product, 201);
    }

    public function update(Request $request, $id) {
        $product = Product::findOrFail($id);

        // Update fields
        $product->name = $request->input('name', $product->name);
        $product->description = $request->input('description', $product->description);
        $product->price = $request->input('price', $product->price);

        // Replace image if a new one is uploaded
        if ($request->hasFile('image')) {
            if ($product->image && file_exists(public_path('images/donuts/' . $product->image))) {
                unlink(public_path('images/donuts/' . $product->image));
            }
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/donuts'), $imageName);
            $product->image = $imageName;
        }

        $product->save();
        return response()->json($product);
    }

    public function destroy($id) {
        $product = Product::findOrFail($id);
        if ($product->image && file_exists(public_path('images/donuts/' . $product->image))) {
            unlink(public_path('images/donuts/' . $product->image));
        }
        $product->delete();
        return response()->json(null, 204);
    }
}
