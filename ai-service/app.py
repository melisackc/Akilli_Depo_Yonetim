from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "AI Service is running 🚀"})

@app.route('/optimize', methods=['POST'])
def optimize_stock():
    """
    AI-based inventory optimization mock endpoint.
    In a real-world scenario, this would use an ML model (like scikit-learn or TensorFlow)
    to predict the optimal minimum stock and reorder quantities based on historical sales data.
    """
    data = request.json
    if not data or 'products' not in data:
        return jsonify({"error": "No products data provided"}), 400
        
    products = data['products']
    optimized_data = []
    
    for product in products:
        # Mock logic: If a product has high turnover (simulated randomly or based on existing stock),
        # increase its minStock. 
        current_min = float(product.get('minStock', 10))
        current_stock = float(product.get('stock', 0))
        
        # Simple heuristic + randomness to simulate "AI" adjustment
        # e.g., if stock goes down very fast, AI predicts higher minStock.
        # Here we just generate a smart-looking recommendation.
        recommended_min = max(5, int(current_min + random.randint(-2, 5)))
        
        # How much should we order when it falls below?
        reorder_qty = max(10, recommended_min * 2)
        
        optimized_data.append({
            "productId": product.get("id"),
            "name": product.get("name"),
            "currentMinStock": current_min,
            "recommendedMinStock": recommended_min,
            "recommendedReorderQty": reorder_qty
        })
        
    return jsonify({
        "message": "Optimization complete",
        "optimized_products": optimized_data
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
