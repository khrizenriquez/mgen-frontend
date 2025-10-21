# PayU Integration Setup Guide

## Environment Variables

Create a `.env` file in the frontend root with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=10000

# PayU Configuration
VITE_PAYU_TEST_MODE=true
VITE_PAYU_COUNTRY=GT
VITE_PAYU_CURRENCY=GTQ

# Application Configuration
VITE_APP_NAME=Donations Management System
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# Authentication (if needed)
VITE_AUTH_REDIRECT_URL=/dashboard

# Feature Flags
VITE_ENABLE_PAYU=true
VITE_ENABLE_ANALYTICS=false
```

## Available Routes

The PayU integration adds the following routes:

- `/donations/:donationId/payment` - Payment page for specific donation
- `/payment/success` - Payment success/return page

## Components

### PayUButton
```jsx
<PayUButton
  donationId="donation-uuid"
  onSuccess={() => console.log('Payment initiated')}
  onError={(error) => console.error('Payment failed', error)}
>
  Pay with PayU
</PayUButton>
```

### PaymentStatus
```jsx
<PaymentStatus
  donationId="donation-uuid"
  showIcon={true}
  polling={true}
  pollingInterval={30000}
/>
```

### DonationCard
```jsx
<DonationCard
  donation={donation}
  showActions={true}
  showPaymentStatus={true}
/>
```

## Hooks

### usePayU
```javascript
const { createPayment, checkPaymentStatus, isLoading } = usePayU()

// Create payment
await createPayment.mutateAsync({
  donationId: 'uuid',
  options: {
    responseUrl: '/payment/success',
    confirmationUrl: '/api/webhooks/payu/confirmation'
  }
})
```

### usePaymentStatus
```javascript
const { data: status, isLoading } = usePaymentStatus(donationId, {
  refetchInterval: 30000 // Poll every 30 seconds
})
```

## Testing

Run the tests with:
```bash
npm run test
```

## Production Deployment

1. Set `VITE_PAYU_TEST_MODE=false` for production
2. Update webhook URLs to production domain
3. Configure proper CORS in backend for production domain
4. Test with PayU production credentials
