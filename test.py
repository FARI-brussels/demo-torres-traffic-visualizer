import math

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in kilometers

    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    
    a = (math.sin(dLat / 2) * math.sin(dLat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dLon / 2) * math.sin(dLon / 2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

def intermediate_point(lat1, lon1, lat2, lon2, fraction):
    R = 6371  # Earth's radius in kilometers
    
    d = haversine_distance(lat1, lon1, lat2, lon2)
    a = math.sin((1 - fraction) * d / R) / math.sin(d / R)
    b = math.sin(fraction * d / R) / math.sin(d / R)

    x = a * math.cos(math.radians(lat1)) * math.cos(math.radians(lon1)) + \
        b * math.cos(math.radians(lat2)) * math.cos(math.radians(lon2))
    y = a * math.cos(math.radians(lat1)) * math.sin(math.radians(lon1)) + \
        b * math.cos(math.radians(lat2)) * math.sin(math.radians(lon2))
    z = a * math.sin(math.radians(lat1)) + b * math.sin(math.radians(lat2))

    lat = math.degrees(math.atan2(z, math.sqrt(x * x + y * y)))
    lon = math.degrees(math.atan2(y, x))

    return lat, lon

def calculate_positions(start_coords, end_coords, speeds, t0, t1, freq):
    # Convert speeds from km/h to km/s
    speeds = [vi / 3600 for vi in speeds]
    
    total_distance = haversine_distance(*start_coords, *end_coords)
    positions_all_vehicles = []

    for t in range(t0, t1 + 1, freq):
        positions_at_t = []
        
        for vi in speeds:
            distance_covered = min(vi * (t - t0), total_distance)
            fraction = distance_covered / total_distance
            lat, lon = intermediate_point(*start_coords, *end_coords, fraction)
            positions_at_t.append((lat, lon))
        
        positions_all_vehicles.append((t, positions_at_t))

    return positions_all_vehicles

# Example usage:
start_coords = (50.86360764932179, 4.332513833979136)
end_coords = (50.86318625738782, 4.3315372212292536)
speeds = [30, 32]  # Speeds for two vehicles in km/h (example values, you can change)
t0 = 0  # Start time in seconds
t1 = 60  # End time in seconds (equivalent to 5 hours)
freq = 1  # Frequency in seconds (equivalent to 1 hour)

positions = calculate_positions(start_coords, end_coords, speeds, t0, t1, freq)

for pos_list in positions:
    t, pos = pos_list[0], pos_list[1]
    print(f"Time {t}s:")
    for i, vehicle_pos in enumerate(pos):
        print(f" - Vehicle {i+1}: Lat: {vehicle_pos[0]}, Lon: {vehicle_pos[1]}")
