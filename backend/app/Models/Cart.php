<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    // Table name (if not "carts")
    protected $table = 'cart_items';

    // Mass assignable fields
    protected $fillable = [
        'product_id',
        'name',
        'price',
        'quantity',
        // 'user_id' // if you associate cart with users
    ];

    // Optional: relation to Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
