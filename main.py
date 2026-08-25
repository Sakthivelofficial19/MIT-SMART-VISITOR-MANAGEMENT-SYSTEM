from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
import uuid

app = FastAPI(title="MIT Smart Visitor Management API")

# Enable CORS for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MySQL Configuration ---
MYSQL_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "Sakthi_VeL@26",
    "database": "mit_vms",
    "port": 3306
}

def get_db_connection():
    return mysql.connector.connect(**MYSQL_CONFIG)

# --- Pydantic Data Validation Model ---
class VisitorData(BaseModel):
    idType: str
    idNumber: str
    fullName: str
    contact: str
    email: str = ""
    address: str = ""
    city: str = ""
    state: str = ""
    pin: str = ""
    purpose: str
    hostName: str = ""
    department: str
    description: str = ""
    expectedExit: str = ""
    byVehicle: bool = False
    vehicleType: str = ""
    vehicleReg: str = ""
    vehicleModel: str = ""

# --- API Endpoints ---
@app.post("/register-visitor")
def register_visitor(visitor: VisitorData):
    # Generate unique primary key ID for the visitor pass
    visitor_id = f"MIT-{uuid.uuid4().hex[:8].upper()}"

    insert_query = """
        INSERT INTO visitors (
            visitor_id, full_name, id_type, id_number, contact, email,
            address, city, state, pin, purpose, host_name, department,
            description, expected_exit, by_vehicle, vehicle_type,
            vehicle_reg, vehicle_model
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        visitor_id,
        visitor.fullName,
        visitor.idType,
        visitor.idNumber,
        visitor.contact,
        visitor.email,
        visitor.address,
        visitor.city,
        visitor.state,
        visitor.pin,
        visitor.purpose,
        visitor.hostName,
        visitor.department,
        visitor.description,
        visitor.expectedExit,
        1 if visitor.byVehicle else 0,
        visitor.vehicleType,
        visitor.vehicleReg,
        visitor.vehicleModel
    )

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(insert_query, values)
        conn.commit()
        cursor.close()
        conn.close()

        return {
            "success": True,
            "visitor_id": visitor_id
        }
    except Error as e:
        print(f"MySQL Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/visitors/{visitor_id}")
def get_visitor(visitor_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM visitors WHERE visitor_id = %s", (visitor_id,))
        visitor = cursor.fetchone()
        cursor.close()
        conn.close()

        if not visitor:
            raise HTTPException(status_code=404, detail="Visitor not found")

        return visitor
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)