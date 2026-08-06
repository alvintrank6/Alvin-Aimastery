import http from 'http';

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runFullCrudTests() {
  console.log('===================================================');
  console.log('=== STARTING COMPLETE ADMIN CRUD TEST SUITE ===');
  console.log('===================================================\n');
  const results = [];

  const record = (name, success, details) => {
    results.push({ name, success, details });
    console.log(`${success ? '✅ PASS' : '❌ FAIL'}: ${name} ${details ? JSON.stringify(details) : ''}`);
  };

  try {
    // 1. TEST USERS CRUD
    console.log('--- 1. Testing Users CRUD ---');
    const usersRes = await request({ hostname: '127.0.0.1', port: 3000, path: '/api/users', method: 'GET' });
    record('GET /api/users', usersRes.status === 200 && Array.isArray(usersRes.data), { count: Array.isArray(usersRes.data) ? usersRes.data.length : 0 });

    if (Array.isArray(usersRes.data) && usersRes.data.length > 0) {
      const targetUser = usersRes.data.find(u => u.role === 'client') || usersRes.data[usersRes.data.length - 1];
      const updateRoleRes = await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/users/${targetUser.id}`, method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      }, { role: 'manager' });
      record('PUT /api/users/:id (Update Role)', updateRoleRes.status === 200 && updateRoleRes.data.role === 'manager');

      // Revert role back
      await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/users/${targetUser.id}`, method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      }, { role: targetUser.role });
    }

    // 2. TEST LEADS CRUD
    console.log('\n--- 2. Testing Leads CRUD ---');
    const testLead = {
      name: 'Full CRUD Lead',
      email: `crud_lead_${Date.now()}@example.com`,
      phone: '0123456789',
      company: 'CRUD Tech',
      service: 'web',
      message: 'Testing lead CRUD flow'
    };
    const createLeadRes = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/leads', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testLead);
    record('POST /api/leads (Create Lead)', createLeadRes.status === 201 && createLeadRes.data.id, { id: createLeadRes.data.id });

    const leadId = createLeadRes.data.id;
    if (leadId) {
      const updateLeadRes = await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/leads/${leadId}`, method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      }, { status: 'Qualified' });
      record('PUT /api/leads/:id (Update Lead Status)', updateLeadRes.status === 200 && updateLeadRes.data.status === 'Qualified');

      const deleteLeadRes = await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/leads/${leadId}`, method: 'DELETE'
      });
      record('DELETE /api/leads/:id (Delete Lead)', deleteLeadRes.status === 200 || deleteLeadRes.status === 204);
    }

    // 3. TEST PROJECTS CRUD
    console.log('\n--- 3. Testing Projects CRUD ---');
    const testProj = {
      name: 'Full CRUD Project',
      clientName: 'Client CRUD',
      clientEmail: `crud_client_${Date.now()}@example.com`,
      service: 'app',
      status: 'New',
      assigneeId: 'Unassigned',
      assigneeName: 'Staff Team',
      deadline: '2026-12-31',
      brief: 'Full CRUD project brief',
      contractValue: 80000000,
      outsourceFee: 30000000,
      taxRate: 10
    };
    const createProjRes = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/projects', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testProj);
    record('POST /api/projects (Create Project)', createProjRes.status === 201 && createProjRes.data.id, { id: createProjRes.data.id });

    const projId = createProjRes.data.id;
    if (projId) {
      const updateProjRes = await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/projects/${projId}`, method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      }, { progress: 75, status: 'Client Review' });
      record('PUT /api/projects/:id (Update Project Progress & Status)', updateProjRes.status === 200 && updateProjRes.data.progress === 75);

      // 4. TEST PAYOUTS CRUD FOR THIS PROJECT
      console.log('\n--- 4. Testing Payouts CRUD ---');
      const createPayoutRes = await request({
        hostname: '127.0.0.1', port: 3000, path: '/api/payouts', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { projectId: projId, amount: 30000000 });
      record('POST /api/payouts (Create Payout)', createPayoutRes.status === 201 && createPayoutRes.data.id, { payoutId: createPayoutRes.data.id });

      const payoutId = createPayoutRes.data.id;
      if (payoutId) {
        const updatePayoutRes = await request({
          hostname: '127.0.0.1', port: 3000, path: `/api/payouts/${payoutId}`, method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        }, { status: 'Approved' });
        record('PUT /api/payouts/:id (Approve Payout)', updatePayoutRes.status === 200 && updatePayoutRes.data.status === 'Approved');

        const deletePayoutRes = await request({
          hostname: '127.0.0.1', port: 3000, path: `/api/payouts/${payoutId}`, method: 'DELETE'
        });
        record('DELETE /api/payouts/:id (Delete Payout)', deletePayoutRes.status === 200 || deletePayoutRes.status === 204);
      }

      // Delete the test project
      const deleteProjRes = await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/projects/${projId}`, method: 'DELETE'
      });
      record('DELETE /api/projects/:id (Delete Project)', deleteProjRes.status === 200 || deleteProjRes.status === 204);
    }

    // 5. TEST SETTINGS & ANALYTICS CRUD
    console.log('\n--- 5. Testing Analytics & Settings CRUD ---');
    const updateTaxRes = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/settings/taxRate', method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, { value: '12' });
    record('PUT /api/settings/:id (Update Tax Rate)', updateTaxRes.status === 200);

    const getTaxRes = await request({ hostname: '127.0.0.1', port: 3000, path: '/api/settings/taxRate', method: 'GET' });
    record('GET /api/settings/:id (Verify Tax Rate)', getTaxRes.status === 200 && getTaxRes.data.value === '12');

    // Revert tax rate to 10
    await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/settings/taxRate', method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, { value: '10' });

  } catch (err) {
    console.error('Test error:', err);
  }

  console.log('\n===================================================');
  console.log('=== CRUD TEST SUMMARY ===');
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`TOTAL CRUD TESTS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('===================================================\n');
}

runFullCrudTests();
