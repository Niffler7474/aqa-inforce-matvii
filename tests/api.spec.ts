const { test, expect } = require('@playwright/test');

test.describe('API Tests', () => {

  test('Create room and verify', async ({ request, browser }) => {
    const context = await browser.newContext();

    const loginResponse = await context.request.post('https://automationintesting.online/auth/login', {
      headers: {
        accept: '*/*',
        Referer: '',
        'Content-Type': 'application/json',
      },
      data: {
        username: 'admin',
        password: 'password',
      },
    });

    expect(loginResponse.status()).toBe(200);

    const roomData = {
      roomName: '201',
      type: 'Single',
      accessible: false,
      description: 'Please enter a description for this room',
      image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
      roomPrice: 100,
      features: ['WiFi', 'TV', 'Refreshments'],
    };

    const createRoomResponse = await context.request.post('https://automationintesting.online/room/', {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json'
      },
      data: roomData,
    });

    expect(createRoomResponse.status()).toBe(201);

    const createRoomResponseBody = await createRoomResponse.json();
    console.log(createRoomResponseBody);

    expect(createRoomResponseBody.roomName).toBe(roomData.roomName);
    expect(createRoomResponseBody.type).toBe(roomData.type);
    expect(createRoomResponseBody.roomPrice).toBe(roomData.roomPrice);
    await context.close();
  });

  test('Book room and verify', async ({ request }) => {
    const bookingData = {
      roomid: 1,
      firstname: "firstname",
      lastname: "lastname",
      depositpaid: true,
      email: "test@email.com",
      phone: "12345678910",
      bookingdates: {
        checkin: "2024-12-01",
        checkout: "2024-12-05"
      }
    };

    const response = await request.post('https://automationintesting.online/booking/', {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      data: bookingData
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    console.log(responseBody);

    expect(responseBody.booking.firstname).toBe(bookingData.firstname);
    expect(responseBody.booking.roomid).toBe(bookingData.roomid);

  });

  test('Edit room and verify', async ({ request, browser }) => {
    const context = await browser.newContext();

    const loginResponse = await context.request.post('https://automationintesting.online/auth/login', {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      data: {
        username: 'admin',
        password: 'password',
      },
    });

    expect(loginResponse.status()).toBe(200);

    const cookies = await context.cookies();
    const tokenCookie = cookies.find(cookie => cookie.name === 'token');
    expect(tokenCookie).toBeDefined();
    const token = tokenCookie.value;

    // Step 2: Create booking
    const bookingData = {
      roomid: 1,
      firstname: 'firstname',
      lastname: 'lastname',
      depositpaid: true,
      email: 'test@email.com',
      phone: '12345678910',
      bookingdates: {
        checkin: '2026-12-01',
        checkout: '2026-12-05',
      },
    };

    const createResponse = await request.post('https://automationintesting.online/booking/', {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      data: bookingData,
    });

    console.log(`Create booking response status: ${createResponse.status()}`);
    expect(createResponse.status()).toBe(201); // For some magic reason, when running a bunch of tests, the status is 409, while if you run a single one, the status is 201. I cannot fix this, sorry :(

    const createResponseBody = await createResponse.json();
    console.log('Create booking response body:', createResponseBody);

    const bookingid = createResponseBody.bookingid;
    console.log('Booking ID:', bookingid);

    const getResponse = await context.request.get(`https://automationintesting.online/booking/${bookingid}`, {
      headers: {
        accept: '*/*',
        'Cookie': `token=${token}`,
      },
    });

    console.log(`Get booking response status: ${getResponse.status()}`);
    if (getResponse.status() === 200) {
      const getResponseBody = await getResponse.json();
      console.log('Booking details:', getResponseBody);

      const payload = {
        bookingid: bookingid,
        roomid: 1,
        firstname: "firstnameedit",
        lastname: "lastnameedit",
        depositpaid: true,
        bookingdates: {
          checkin: "2024-12-01",
          checkout: "2024-12-06",
        },
      };

      const PUTResponse = await context.request.put(`https://automationintesting.online/booking/${bookingid}`, {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`,
        },
        data: payload,
      });


      console.log('Edited booking details:', PUTResponse);
      console.log(`Edit booking response status: ${PUTResponse.status()}`);
      const putResponseBody = await PUTResponse.json();
      console.log('Edited booking details:', putResponseBody);


      expect(PUTResponse.status()).toBe(200);

      const verifyResponse = await context.request.get(`https://automationintesting.online/booking/${bookingid}`, {
        headers: {
          accept: '*/*',
        },
      });

      console.log(`Verify booking response status: ${verifyResponse.status()}`);
      expect(verifyResponse.status()).toBe(200);

      const verifyResponseBody = await verifyResponse.json();
      console.log('Verified booking details:', verifyResponseBody);

      console.log(`Expected firstname: ${payload.firstname}, Actual firstname: ${verifyResponseBody.firstname}`);
      expect(verifyResponseBody.firstname).toBe(payload.firstname);
      console.log(`Expected lastname: ${payload.lastname}, Actual lastname: ${verifyResponseBody.lastname}`);
      expect(verifyResponseBody.lastname).toBe(payload.lastname);
      console.log(`Expected checkin: ${payload.bookingdates.checkin}, Actual checkin: ${verifyResponseBody.bookingdates.checkin}`);
      expect(verifyResponseBody.bookingdates.checkin).toBe(payload.bookingdates.checkin);
      console.log(`Expected checkout: ${payload.bookingdates.checkout}, Actual checkout: ${verifyResponseBody.bookingdates.checkout}`);
      expect(verifyResponseBody.bookingdates.checkout).toBe(payload.bookingdates.checkout);
    } else {
      console.log('Error:', getResponse.status());
    }
  });

  test('Create and delete room and verify', async ({ request, browser }) => {
    const context = await browser.newContext();

    const loginResponse = await context.request.post('https://automationintesting.online/auth/login', {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      data: {
        username: 'admin',
        password: 'password',
      },
    });

    console.log(`Login response status: ${loginResponse.status()}`);
    expect(loginResponse.status()).toBe(200);

    const cookies = await context.cookies();
    const tokenCookie = cookies.find(cookie => cookie.name === 'token');
    expect(tokenCookie).toBeDefined();
    const token = tokenCookie.value;
    console.log('Token:', token);

    const bookingData = {
      roomid: 1,
      firstname: 'firstname',
      lastname: 'lastname',
      depositpaid: true,
      email: 'test@email.com',
      phone: '12345678910',
      bookingdates: {
        checkin: '2025-12-01',
        checkout: '2025-12-05',
      },
    };

    const createResponse = await request.post('https://automationintesting.online/booking/', {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      data: bookingData,
    });

    console.log(`Create booking response status: ${createResponse.status()}`);
    expect(createResponse.status()).toBe(201);

    const createResponseBody = await createResponse.json();
    console.log('Create booking response body:', createResponseBody);

    const bookingid = createResponseBody.bookingid;
    console.log('Booking ID:', bookingid);

    const getResponse = await context.request.get(`https://automationintesting.online/booking/${bookingid}`, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
    });

    console.log(`Get booking response status: ${getResponse.status()}`);
    if (getResponse.status() === 200) {
      const getResponseBody = await getResponse.json();
      console.log('Booking details:', getResponseBody);

      const deleteResponse = await context.request.delete(`https://automationintesting.online/booking/${bookingid}`, {
        headers: {
          accept: '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`Delete booking response status: ${deleteResponse.status()}`);
      expect(deleteResponse.status()).toBe(202);

    } else {
      console.log('Booking not found or error:', getResponse.status());
    }
  });


});

