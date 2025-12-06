<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product; 

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Choco Star Delight', 'description' => 'Rich chocolate glaze with golden sprinkles.', 'price' => 49, 'image' => 'donut-1.png'],
            ['name' => 'Classic Glaze', 'description' => 'Simple, sweet, and timeless.', 'price' => 39, 'image' => 'donut-2.png'],
            ['name' => 'Nutty Crunch', 'description' => 'Chocolate donut with roasted nuts.', 'price' => 55, 'image' => 'donut-3.png'],
            ['name' => 'Mocha Swirl', 'description' => 'Coffee-choco swirl perfection.', 'price' => 52, 'image' => 'donut-4.png'],
            ['name' => 'Cookie Crumble', 'description' => 'Topped with cookie bits and dark glaze.', 'price' => 58, 'image' => 'donut-5.png'],
            ['name' => 'Caramel Cloud', 'description' => 'Soft donut with caramel drizzle.', 'price' => 45, 'image' => 'donut-6.png'],
            ['name' => 'Orange Drizzle', 'description' => 'Zesty orange glaze with choco lines.', 'price' => 48, 'image' => 'donut-7.png'],
            ['name' => 'Vanilla Fudge Stripe', 'description' => 'Vanilla glaze with chocolate drizzle.', 'price' => 47, 'image' => 'donut-8.png'],
            ['name' => 'Sugar Puff', 'description' => 'Soft donut dusted with sugar.', 'price' => 35, 'image' => 'donut-9.png'],
            ['name' => 'Choco Lines', 'description' => 'White glaze with bold choco stripes.', 'price' => 42, 'image' => 'donut-10.png'],
            ['name' => 'Honey Loop', 'description' => 'Sweet donut with honey drizzle.', 'price' => 44, 'image' => 'donut-11.png'],
            ['name' => 'Strawberry Dream', 'description' => 'Pink glaze with sugar pearls.', 'price' => 50, 'image' => 'donut-12.png'],
            ['name' => 'Pink Paradise', 'description' => 'Strawberry glaze with sprinkles.', 'price' => 48, 'image' => 'donut-13.png'],
            ['name' => 'Orange Sprinkle Joy', 'description' => 'Citrus glaze with rainbow sprinkles.', 'price' => 46, 'image' => 'donut-14.png'],
            ['name' => 'Candy Dot Fun', 'description' => 'Covered in candy-coated chocolates.', 'price' => 55, 'image' => 'donut-15.png'],
            ['name' => 'Pistachio Pop', 'description' => 'Green glaze with crushed pistachios.', 'price' => 60, 'image' => 'donut-16.png'],
            ['name' => 'Tropical Wave', 'description' => 'Blue glaze with a coconut twist.', 'price' => 52, 'image' => 'donut-17.png'],
            ['name' => 'Moston Treme', 'description' => "Competitor's Best Seller", 'price' => 1, 'image' => 'donut-18.png'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}