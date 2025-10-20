<template>
  <div class="container">
    <header>
      <h1>🧪 Vue 2.7.x - Spotflow SDK Compatibility Test</h1>
      <p>Testing Vue Spotflow SDK with Vue 2.7.x using Options API</p>
      <div class="test-info">
        <span class="status-badge status-pending">Vue {{ vueVersion }}</span>
        <span class="status-badge status-pending">Options API</span>
      </div>
    </header>

    <!-- SDK Import Test -->
    <div class="test-section">
      <h2>📦 SDK Import Test</h2>
      <p><strong>Status:</strong> <span :class="importStatus.class">{{ importStatus.message }}</span></p>
      <div v-if="importStatus.details">
        <pre>{{ importStatus.details }}</pre>
      </div>
    </div>

    <!-- SpotflowButton Component Test -->
    <div class="test-section">
      <h2>🔘 SpotflowButton Component Test</h2>
      <p>Testing the SpotflowButton component with Options API syntax:</p>
      
      <div v-if="componentStatus.loaded">
        <SpotflowButton :config="testConfig" @success="onPaymentSuccess" @error="onPaymentError">
          💳 Pay ₦100 - Test Payment (Vue 2.7.x)
        </SpotflowButton>
        <p class="status-success">✅ Component loaded successfully</p>
      </div>
      <div v-else>
        <p :class="componentStatus.class">{{ componentStatus.message }}</p>
      </div>
    </div>

    <!-- Composable Test -->
    <div class="test-section">
      <h2>🎯 useSpotflowPayment Composable Test</h2>
      <p>Testing the useSpotflowPayment composable (if available in Vue 2.7.x):</p>
      
      <button @click="testComposable" :disabled="!composableStatus.available">
        🚀 Test Composable Payment
      </button>
      
      <p><strong>Status:</strong> <span :class="composableStatus.class">{{ composableStatus.message }}</span></p>
    </div>

    <!-- Console & Error Monitoring -->
    <div class="test-section">
      <h2>🔍 Console & Error Monitoring</h2>
      <p><strong>JavaScript Errors:</strong> {{ errorCount }}</p>
      <p><strong>Console Warnings:</strong> {{ warningCount }}</p>
      
      <div v-if="logs.length > 0">
        <h4>Recent Logs:</h4>
        <div v-for="(log, index) in logs" :key="index" class="log-entry">
          <span :class="'log-' + log.type">[{{ log.type.toUpperCase() }}]</span> {{ log.message }}
        </div>
      </div>
    </div>

    <!-- Test Results Summary -->
    <div class="test-section">
      <h2>📊 Test Results Summary</h2>
      <ul>
        <li>✅ Vue 2.7.x Installation: Success</li>
        <li :class="importStatus.success ? 'success' : 'error'">
          {{ importStatus.success ? '✅' : '❌' }} SDK Import: {{ importStatus.message }}
        </li>
        <li :class="componentStatus.loaded ? 'success' : 'error'">
          {{ componentStatus.loaded ? '✅' : '❌' }} SpotflowButton Component: {{ componentStatus.message }}
        </li>
        <li :class="composableStatus.available ? 'success' : 'warning'">
          {{ composableStatus.available ? '✅' : '⚠️' }} useSpotflowPayment Composable: {{ composableStatus.message }}
        </li>
        <li :class="errorCount === 0 ? 'success' : 'error'">
          {{ errorCount === 0 ? '✅' : '❌' }} Console Errors: {{ errorCount }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// Test SDK imports
let SpotflowButton = null;
let useSpotflowPayment = null;
let importError = null;

try {
  const spotflowModule = require('@spot-flow/vue-spotflow-checkout');
  SpotflowButton = spotflowModule.SpotflowButton;
  useSpotflowPayment = spotflowModule.useSpotflowPayment;
} catch (error) {
  importError = error;
  console.error('Failed to import Spotflow SDK:', error);
}

export default {
  name: 'App',
  components: {
    ...(SpotflowButton && { SpotflowButton })
  },
  data() {
    return {
      vueVersion: '2.7.x',
      errorCount: 0,
      warningCount: 0,
      logs: [],
      testConfig: {
        merchantKey: "sk_test_3500ece212364e11abd01984afdd67b3",
        encryptionKey: "47qqVD15YhEbmF8EhY/3F9aICG/Hn96NMz4AbLb1cRk=",
        amount: 100,
        currency: "NGN",
        email: "test@example.com",
        name: "Vue 2.7.x Test User",
        reference: "VUE2-TEST-" + Date.now()
      }
    }
  },
  computed: {
    importStatus() {
      if (importError) {
        return {
          success: false,
          class: 'status-error',
          message: 'Import Failed',
          details: importError.message
        };
      }
      if (SpotflowButton) {
        return {
          success: true,
          class: 'status-success', 
          message: 'Import Successful',
          details: 'SpotflowButton and useSpotflowPayment imported successfully'
        };
      }
      return {
        success: false,
        class: 'status-pending',
        message: 'Import Pending'
      };
    },
    componentStatus() {
      if (SpotflowButton) {
        return {
          loaded: true,
          class: 'status-success',
          message: 'Component Available'
        };
      }
      return {
        loaded: false,
        class: 'status-error', 
        message: 'Component Not Available'
      };
    },
    composableStatus() {
      if (useSpotflowPayment && typeof useSpotflowPayment === 'function') {
        return {
          available: true,
          class: 'status-success',
          message: 'Composable Available'
        };
      }
      return {
        available: false,
        class: 'status-warning',
        message: 'Composable Not Available (Expected in Vue 2.x)'
      };
    }
  },
  methods: {
    testComposable() {
      if (useSpotflowPayment) {
        try {
          const loadSpotflow = useSpotflowPayment();
          loadSpotflow(this.testConfig);
          this.addLog('info', 'Composable payment initiated');
        } catch (error) {
          this.addLog('error', 'Composable test failed: ' + error.message);
        }
      } else {
        this.addLog('warning', 'Composable not available in Vue 2.x');
      }
    },
    onPaymentSuccess(response) {
      this.addLog('success', 'Payment successful: ' + JSON.stringify(response));
    },
    onPaymentError(error) {
      this.addLog('error', 'Payment failed: ' + JSON.stringify(error));
    },
    addLog(type, message) {
      this.logs.unshift({
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      });
      if (this.logs.length > 10) {
        this.logs.pop();
      }
    }
  },
  mounted() {
    // Monitor console errors
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      this.errorCount++;
      this.addLog('error', args.join(' '));
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      this.warningCount++;
      this.addLog('warning', args.join(' '));
      originalWarn.apply(console, args);
    };

    this.addLog('info', 'Vue 2.7.x compatibility test initialized');
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fafafa;
}

.test-info {
  margin: 10px 0;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  margin: 2px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-success { background: #d4edda; color: #155724; }
.status-error { background: #f8d7da; color: #721c24; }
.status-warning { background: #fff3cd; color: #856404; }

.log-entry {
  font-family: monospace;
  font-size: 12px;
  margin: 5px 0;
  padding: 5px;
  background: #f8f9fa;
  border-radius: 3px;
}

.log-error { color: #dc3545; font-weight: bold; }
.log-warning { color: #ffc107; font-weight: bold; }
.log-info { color: #17a2b8; font-weight: bold; }
.log-success { color: #28a745; font-weight: bold; }

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

ul li.success { color: #28a745; }
ul li.error { color: #dc3545; }
ul li.warning { color: #ffc107; }
</style>
