<template>

  <button ref="buttonRef" v-bind="$attrs" :disabled="disabled" :class="computedClass" :style="style"
    @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
import { useSpotflowPayment } from './composables/useSpotflowPayment'

interface Props {
  config: any
  disabled?: boolean
  class?: string | string[] | Record<string, boolean>
  style?: string | Record<string, any>
}


const props = withDefaults(defineProps<Props>(), {
  disabled: false
})


// This allows all native button attributes to pass through
defineOptions({
  inheritAttrs: false
})

const emit = defineEmits(['ready', 'error'])


const buttonRef = ref<HTMLButtonElement | null>(null)
const loadSpotflow = useSpotflowPayment()

const computedClass = computed(() => {
  return props.class
})

const handleClick = async (event: MouseEvent) => {
  if (props.disabled) return
  event.preventDefault()
  await
  loadSpotflow(props.config)
}

defineExpose({
  buttonRef,
})

</script>
