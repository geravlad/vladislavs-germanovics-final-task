export interface ShopUser {
  name: string;
  email: string;
  password: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
}

export interface CardDetails {
  name: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export function generateUser(): ShopUser {
  const id = `${Date.now()}${Math.floor(Math.random() * 100000)}`;

  return {
    name: `TestUser${id}`,
    email: `testuser${id}@test.com`,
    password: 'Test1234!',
    birthDay: '1',
    birthMonth: 'January',
    birthYear: '1990',
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test Street',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    zipCode: '10001',
    mobileNumber: '1234567890',
  };
}

export const cardData: CardDetails = {
  name: 'Test User',
  cardNumber: '123456789',
  cvc: '123',
  expiryMonth: '01',
  expiryYear: '2077',
};