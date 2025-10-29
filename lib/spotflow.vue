<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button ref="buttonRef" v-bind="$attrs" :disabled="disabled" :class="computedClass" :style="style"
    @click="handleClick">
    <slot></slot>
  </button>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSpotflowPayment } from './composables/useSpotflowPayment'
import type { SpotflowPaymentOptions } from './types'

interface SpotflowButtonProps {
  /** Payment configuration options */
  config: SpotflowPaymentOptions
  /** Whether the button is disabled */
  disabled?: boolean
  /** CSS classes for styling */
  class?: string | string[] | Record<string, boolean>
  /** Inline styles */
  style?: string | Record<string, string | number>
}

type Props = SpotflowButtonProps

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

// This allows all native button attributes to pass through
defineOptions({
  inheritAttrs: false
})

const buttonRef = ref<HTMLButtonElement | null>(null)
const loadSpotflow = useSpotflowPayment()

const computedClass = computed(() => {
  return props.class
})

const emit = defineEmits<{
  /** Emitted when payment is initiated */
  paymentStart: []
  /** Emitted when payment succeeds */
  paymentSuccess: [data: unknown]
  /** Emitted when payment fails */
  paymentError: [error: Error]
}>()

const handleClick = async (event: MouseEvent): Promise<void> => {
  if (props.disabled) return
  event.preventDefault()
  
  try {
    emit('paymentStart')
    await loadSpotflow(props.config)
    // Note: Success/error events would need to be handled by the Spotflow SDK
  } catch (error) {
    emit('paymentError', error as Error)
  }
}

defineExpose({
  buttonRef
})
</script>
