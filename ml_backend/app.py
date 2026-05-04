from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app) # Allow cross-origin requests from the React Native frontend

@app.route('/predict', methods=['POST'])
def predict_cycle():
    try:
        data = request.get_json()
        past_cycles = data.get('past_cycles', [])

        # If no data is provided, return the default 28 days
        if not past_cycles or len(past_cycles) == 0:
            return jsonify({'predicted_length': 28})

        # If there is not enough data (less than 3 cycles), calculate the simple average
        if len(past_cycles) < 3:
            avg = sum(past_cycles) / len(past_cycles)
            return jsonify({'predicted_length': int(round(avg))})

        # Machine Learning (Linear Regression) implementation
        X = np.array(range(len(past_cycles))).reshape(-1, 1)
        y = np.array(past_cycles)

        model = LinearRegression()
        model.fit(X, y) # Train the model with past cycle data

        # Predict the length of the next cycle
        next_index = np.array([[len(past_cycles)]])
        predicted_val = model.predict(next_index)[0]

        # Constrain the predicted value to a realistic range (21 to 35 days)
        predicted_length = max(21, min(35, int(round(predicted_val))))

        return jsonify({'predicted_length': predicted_length})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'predicted_length': 28}) # Return default on error

if __name__ == '__main__':
    # Start the server on port 8000
    app.run(host='0.0.0.0', port=8000, debug=True)