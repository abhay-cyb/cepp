import os
from flask import Flask, render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from datetime import datetime, date, timedelta
from extensions import db, login_manager, bcrypt
from models import User, Food, Leftover, Meal, WasteRecord

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here_change_in_production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///foodsave.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
login_manager.init_app(app)
bcrypt.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- TEMPLATE FILTERS & UTILS ---
def get_food_status(expiry_date):
    today = date.today()
    delta = (expiry_date - today).days
    if delta < 0:
        return 'Expired'
    elif 0 <= delta <= 3:
        return 'Expiring Soon'
    else:
        return 'Safe'

app.jinja_env.globals.update(get_food_status=get_food_status)

# --- ROUTES ---

@app.route('/')
def home():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return redirect(url_for('register'))
            
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email address already exists.', 'danger')
            return redirect(url_for('register'))
            
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(name=name, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        flash('Your account has been created! You can now log in.', 'success')
        return redirect(url_for('login'))
        
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password_hash, password):
            login_user(user, remember=True)
            next_page = request.args.get('next')
            flash(f'Welcome back, {user.name}!', 'success')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Login unsuccessful. Please check email and password.', 'danger')
            
    return render_template('login.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/dashboard')
@login_required
def dashboard():
    foods = Food.query.filter_by(user_id=current_user.id).all()
    leftovers = Leftover.query.filter_by(user_id=current_user.id, status='Available').all()
    waste_records = WasteRecord.query.filter_by(user_id=current_user.id).all()
    
    total_items = len(foods)
    expiring_soon = 0
    expired = 0
    today = date.today()
    
    for food in foods:
        delta = (food.expiry_date - today).days
        if delta < 0:
            expired += 1
        elif 0 <= delta <= 3:
            expiring_soon += 1
            
    leftovers_count = len(leftovers)
    
    # Calculate rough food wasted weight (assuming quantity has numbers)
    food_wasted = 0
    for w in waste_records:
        try:
            val = float(''.join(c for c in w.quantity if c.isdigit() or c == '.'))
            if 'g' in w.quantity.lower() and 'kg' not in w.quantity.lower():
                val = val / 1000
            food_wasted += val
        except:
            pass
            
    # Recent foods
    recent_foods = Food.query.filter_by(user_id=current_user.id).order_by(Food.id.desc()).limit(5).all()
    
    # Alert for expiring soon
    expiring_alerts = [f for f in foods if 0 <= (f.expiry_date - today).days <= 3]
    
    return render_template('dashboard.html', 
                          total_items=total_items, 
                          expiring_soon=expiring_soon, 
                          expired=expired,
                          leftovers_count=leftovers_count,
                          food_wasted=round(food_wasted, 2),
                          recent_foods=recent_foods,
                          expiring_alerts=expiring_alerts)

@app.route('/add_food', methods=['GET', 'POST'])
@login_required
def add_food():
    if request.method == 'POST':
        food_name = request.form.get('food_name')
        category = request.form.get('category')
        quantity = request.form.get('quantity')
        purchase_date_str = request.form.get('purchase_date')
        expiry_date_str = request.form.get('expiry_date')
        storage_location = request.form.get('storage_location')
        
        purchase_date = datetime.strptime(purchase_date_str, '%Y-%m-%d').date()
        expiry_date = datetime.strptime(expiry_date_str, '%Y-%m-%d').date()
        
        new_food = Food(user_id=current_user.id, food_name=food_name, category=category,
                        quantity=quantity, purchase_date=purchase_date, expiry_date=expiry_date,
                        storage_location=storage_location)
        db.session.add(new_food)
        db.session.commit()
        flash('Food added successfully!', 'success')
        return redirect(url_for('inventory'))
        
    return render_template('add_food.html')

@app.route('/inventory')
@login_required
def inventory():
    foods = Food.query.filter_by(user_id=current_user.id).all()
    return render_template('inventory.html', foods=foods)

@app.route('/inventory/delete/<int:id>', methods=['POST'])
@login_required
def delete_food(id):
    food = Food.query.get_or_404(id)
    if food.user_id != current_user.id:
        flash('Unauthorized action', 'danger')
        return redirect(url_for('inventory'))
    db.session.delete(food)
    db.session.commit()
    flash('Food item deleted', 'success')
    return redirect(url_for('inventory'))

@app.route('/expiry_tracker')
@login_required
def expiry_tracker():
    foods = Food.query.filter_by(user_id=current_user.id).order_by(Food.expiry_date).all()
    today = date.today()
    
    safe_foods = []
    expiring_soon = []
    expired = []
    
    for f in foods:
        delta = (f.expiry_date - today).days
        if delta < 0:
            expired.append(f)
        elif 0 <= delta <= 3:
            expiring_soon.append(f)
        else:
            safe_foods.append(f)
            
    return render_template('expiry_tracker.html', 
                           safe_foods=safe_foods, 
                           expiring_soon=expiring_soon, 
                           expired=expired,
                           today=today)

@app.route('/leftovers', methods=['GET', 'POST'])
@login_required
def leftovers():
    if request.method == 'POST':
        food_name = request.form.get('food_name')
        quantity = request.form.get('quantity')
        date_added = datetime.strptime(request.form.get('date'), '%Y-%m-%d').date()
        reminder_date = request.form.get('reminder_date')
        if reminder_date:
            reminder_date = datetime.strptime(reminder_date, '%Y-%m-%d').date()
        else:
            reminder_date = None
            
        new_leftover = Leftover(user_id=current_user.id, food_name=food_name, 
                                quantity=quantity, date_added=date_added, reminder_date=reminder_date)
        db.session.add(new_leftover)
        db.session.commit()
        flash('Leftover added successfully', 'success')
        return redirect(url_for('leftovers'))
        
    leftover_items = Leftover.query.filter_by(user_id=current_user.id, status='Available').all()
    return render_template('leftovers.html', leftovers=leftover_items)

@app.route('/leftovers/consume/<int:id>', methods=['POST'])
@login_required
def consume_leftover(id):
    leftover = Leftover.query.get_or_404(id)
    if leftover.user_id != current_user.id:
        return redirect(url_for('leftovers'))
    leftover.status = 'Consumed'
    db.session.commit()
    flash('Leftover marked as consumed!', 'success')
    return redirect(url_for('leftovers'))

@app.route('/leftovers/waste/<int:id>', methods=['POST'])
@login_required
def waste_leftover(id):
    leftover = Leftover.query.get_or_404(id)
    if leftover.user_id != current_user.id:
        return redirect(url_for('leftovers'))
    leftover.status = 'Wasted'
    
    waste_record = WasteRecord(user_id=current_user.id, food_name=leftover.food_name, 
                               quantity=leftover.quantity, reason='Leftover wasted')
    db.session.add(waste_record)
    db.session.commit()
    flash('Leftover marked as wasted and added to waste reports.', 'warning')
    return redirect(url_for('leftovers'))
    
@app.route('/leftovers/delete/<int:id>', methods=['POST'])
@login_required
def delete_leftover(id):
    leftover = Leftover.query.get_or_404(id)
    if leftover.user_id == current_user.id:
        db.session.delete(leftover)
        db.session.commit()
        flash('Leftover deleted.', 'success')
    return redirect(url_for('leftovers'))

@app.route('/meal_planner', methods=['GET', 'POST'])
@login_required
def meal_planner():
    if request.method == 'POST':
        day = request.form.get('day')
        meal_type = request.form.get('meal_type')
        meal_name = request.form.get('meal_name')
        ingredients = request.form.get('ingredients')
        
        new_meal = Meal(user_id=current_user.id, day=day, meal_type=meal_type, 
                        meal_name=meal_name, ingredients=ingredients)
        db.session.add(new_meal)
        db.session.commit()
        flash('Meal added successfully', 'success')
        return redirect(url_for('meal_planner'))
        
    meals = Meal.query.filter_by(user_id=current_user.id).all()
    foods = Food.query.filter_by(user_id=current_user.id).all()
    safe_foods = [f for f in foods if get_food_status(f.expiry_date) != 'Expired']
    
    planner = {
        'Monday': {'Breakfast': [], 'Lunch': [], 'Dinner': []},
        'Tuesday': {'Breakfast': [], 'Lunch': [], 'Dinner': []},
        'Wednesday': {'Breakfast': [], 'Lunch': [], 'Dinner': []},
        'Thursday': {'Breakfast': [], 'Lunch': [], 'Dinner': []},
        'Friday': {'Breakfast': [], 'Lunch': [], 'Dinner': []},
        'Saturday': {'Breakfast': [], 'Lunch': [], 'Dinner': []},
        'Sunday': {'Breakfast': [], 'Lunch': [], 'Dinner': []}
    }
    
    for meal in meals:
        if meal.day in planner and meal.meal_type in planner[meal.day]:
            planner[meal.day][meal.meal_type].append(meal)
            
    return render_template('meal_planner.html', planner=planner, available_foods=safe_foods)

@app.route('/meal_planner/delete/<int:id>', methods=['POST'])
@login_required
def delete_meal(id):
    meal = Meal.query.get_or_404(id)
    if meal.user_id == current_user.id:
        db.session.delete(meal)
        db.session.commit()
        flash('Meal deleted.', 'success')
    return redirect(url_for('meal_planner'))

@app.route('/reports')
@login_required
def reports():
    foods = Food.query.filter_by(user_id=current_user.id).all()
    leftovers = Leftover.query.filter_by(user_id=current_user.id).all()
    waste_records = WasteRecord.query.filter_by(user_id=current_user.id).all()
    
    food_added = len(foods)
    food_wasted = len(waste_records)
    food_consumed = len([l for l in leftovers if l.status == 'Consumed'])
    
    # Send data as JSON for charts
    categories = {}
    for w in waste_records:
        cat = 'Other'
        # Trying to guess category if it was in Food table, but WasteRecord doesn't have it explicitly unless we save it.
        # So let's find the food item or default to Other
        food_item = Food.query.filter_by(user_id=current_user.id, food_name=w.food_name).first()
        if food_item:
            cat = food_item.category
        categories[cat] = categories.get(cat, 0) + 1
        
    return render_template('reports.html', 
                           food_added=food_added, 
                           food_consumed=food_consumed, 
                           food_wasted=food_wasted,
                           leftovers_total=len(leftovers),
                           categories_data=categories)

@app.route('/tips')
def tips():
    return render_template('tips.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5001)
