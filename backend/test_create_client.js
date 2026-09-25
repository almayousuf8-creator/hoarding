async function testCreate() {
  try {
    const res = await fetch('http://localhost:5000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Client',
        email: 'test@example.com',
        phone: '1234567890',
        address: 'Test Addr',
        hoarding_id: 1, // Assuming hoarding 1 exists
        status: 'ACTIVE'
      })
    });
    const data = await res.json();
    console.log("Create response:", data);
    
    // Fetch clients to see if hoarding_name is returned
    const getRes = await fetch('http://localhost:5000/api/clients');
    const getData = await getRes.json();
    const newClient = getData.data.find(c => c.name === 'Test Client');
    console.log("Created client record:", newClient);
  } catch (e) {
    console.error(e);
  }
}

testCreate();
