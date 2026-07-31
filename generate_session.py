import urllib.request
import json
import random

print("=" * 70)
print("🛡️ AuditAI Decision Path Auditor (Live API Submission)")
print("=" * 70)

credit_score = random.randint(580, 800)
loan_amount = random.randint(10000, 60000)

payload = {
    "agent_name": "LoanEvaluator-v4",
    "credit_score": credit_score,
    "requested_amount": loan_amount
}
data_bytes = json.dumps(payload).encode('utf-8')

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/decision/execute", 
    data=data_bytes, 
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        
        session_id = result['session_id']
        print(f"✅ Successfully created a REAL session in the database!")
        print(f"Session ID : {session_id}")
        print(f"User ID    : {result['user_id']}")
        print(f"Decision   : {result['decision']}")
        
        print("\n" + "=" * 70)
        print("📄 FULL SESSION OUTPUT FROM DATABASE")
        print("=" * 70)
        
        # Fetch the newly created session from the database API
        req_get = urllib.request.Request(f"http://127.0.0.1:8000/decision-path/session/{session_id}")
        with urllib.request.urlopen(req_get) as get_response:
            session_data = json.loads(get_response.read().decode())
            # Print the timeline events nicely formatted
            print(json.dumps(session_data.get("timeline", []), indent=2))
            
except Exception as e:
    print(f"❌ Failed to connect to the backend API: {e}")
    print("Make sure your FastAPI backend is running on http://127.0.0.1:8000")