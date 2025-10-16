<script setup lang="ts">
   import { useSpotflowPayment } from '@library/index'

   const loadSpotflow = useSpotflowPayment()

   const handlePayment = async () => {
     const config = {
       amount: 4000, // Not required for subscription payment
       currency: "NGN",
       email: "temi@mailinator.com", // Email of customer
       name: "John", // Name of customer: Not required
       phoneNumber: "09090909090", // Phone number of customer: Not required
       reference: "MC-123456", // Not required, a unique payment reference will be generated if not provided
       merchantKey: "sk_test_fXXXXedhXXXXXXXXXXXXXXXX",
       planId: "9e0808304-344d-XXXXXXXXX-XXXXX834034", // Not required for a one time payment
       encryptionKey:"SKKXXXXXXXXXXXXXXXXX"
     }
       await loadSpotflow(config)
   }
 </script>

 <template>
   <div>
   <button @click="handlePayment">
     Make Payment
   </button>
   </div>
 </template>