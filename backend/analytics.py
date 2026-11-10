
import json

# Read seller data from JSON file
def load_seller_data():
    with open("seller_data.json", "r") as file:
        return json.load(file)


# Calculate business performance
def calculate_metrics():

    data = load_seller_data()

    last_sales = data["sales"]["last_month"]
    current_sales = data["sales"]["this_month"]

    last_orders = data["orders"]["last_month"]
    current_orders = data["orders"]["this_month"]

    last_cancel = data["cancellation_rate"]["last_month"]
    current_cancel = data["cancellation_rate"]["this_month"]

    last_stock = data["out_of_stock_products"]["last_month"]
    current_stock = data["out_of_stock_products"]["this_month"]

    # Calculate percentage changes
    sales_decline = ((last_sales - current_sales) / last_sales) * 100

    order_decline = ((last_orders - current_orders) / last_orders) * 100

    cancellation_increase = current_cancel - last_cancel

    stock_increase = current_stock - last_stock

    return {
        "seller_name": data["seller_name"],
        "business_category": data["business_category"],
        "last_month_sales": last_sales,
        "current_month_sales": current_sales,
        "sales_decline_percentage": round(sales_decline, 2),
        "last_month_orders": last_orders,
        "current_month_orders": current_orders,
        "order_decline_percentage": round(order_decline, 2),
        "cancellation_rate_increase": cancellation_increase,
        "out_of_stock_increase": stock_increase,
        "average_selling_price": data["average_selling_price"]["this_month"]
    }
