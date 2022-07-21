<template>
    <div class="alpheios-al-editor-languages-block" :class="layoutClass" >
      <draggable
        :list="identList"
        item-key="targetId"
        class="alpheios-al-editor-languages-list"
        ghost-class="ghost"
        @start="dragging = true"
        @end="endDrag"
      >
        <template #item="{ element }">
          <div 
             :class="identClasses(element)" 
             @click = "toggleIdentDataVisibility(element)" >
            {{ element.identName }}
          </div>
        </template>
      </draggable>
    </div>
</template>

<script>
import Draggable from '@vuedraggable'
import GroupUtility from '@/_output/utility/group-utility.js'

export default {
  name: 'LanguagesBlock',
  components: {
    draggable: Draggable
  },
  inject: ['$fullData'],
  props: {
    layout: {
      type: String,
      required: false,
      default: 'horizontal'
    },
    view: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      identList: [],
      dragging: false
    }
  },
  mounted () {
    this.identList = GroupUtility.allIdentificationTargets(this.$fullData, this.view)
  },
  computed: {
    avaliableIdents () {
      return this.identList.filter(identDataItem => !identDataItem.hidden).length
    },
    identFilteringAvailable () {
      return this.avaliableIdents > 1
    },
    layoutClass () {
      return `alpheios-al-editor-languages-block-${this.layout}`
    }
  },
  methods: {
    endDrag (e) {
      this.dragging = false
      if (e.oldDraggableIndex !== e.newDraggableIndex) {
        const identsList = this.identList.map(identData => identData.targetId)
        this.$emit('changeOrder', { identsList, view: this.view } )
      }
    },

    identClasses (identData) {
      return {
        'alpheios-al-editor-languages-list-item': true,
        'alpheios-al-editor-languages-list-item-clickable': this.identFilteringAvailable || identData.hidden,
        'alpheios-al-editor-languages-list-item__inactive': identData.hidden
      }
    },

    toggleIdentDataVisibility (identData) {
      if (this.identFilteringAvailable || identData.hidden) {
        identData.hidden = !identData.hidden
        this.$emit('updateVisibility', { identData, view: this.view })
      }
    }
  }
}

</script>

<script setup>
/*
import draggable from '@vuedraggable'
import GroupUtility from '@/_output/utility/group-utility.js'

import { computed, inject, reactive, onMounted, watch, ref, nextTick } from 'vue'

const emit = defineEmits([ 'changeOrder', 'updateVisibility' ])
const $fullData = inject('$fullData')

const props = defineProps({
  layout: {
    type: String,
    required: false,
    default: 'horizontal'
  },
  view: {
    type: String,
    required: true
  }
})

const state = reactive({
  identList: [],
  dragging: false
})

onMounted(() => {
  state.identList = GroupUtility.allIdentificationTargets($fullData, props.view)
  console.info('state.identList - ', state.identList)
})

const avaliableIdents = computed(() => {
  return state.identList.filter(identDataItem => !identDataItem.hidden).length
})

const identFilteringAvailable = computed(() => {
  return avaliableIdents.value > 1
})

const layoutClass = computed(() => {
  return `alpheios-al-editor-languages-block-${props.layout}`
})

const endDrag = (e) => {
  state.dragging = false
  if (e.oldDraggableIndex !== e.newDraggableIndex) {
    const identsList = state.identList.map(identData => identData.targetId)
    emit('changeOrder', { identsList, view: props.view } )
  }
}

const identClasses = (identData) => {
  console.info('identClasses identData - ', identData)
  return {
    'alpheios-al-editor-languages-list-item': true,
    // 'alpheios-al-editor-languages-list-item-clickable': identFilteringAvailable.value || identData.hidden,
    // 'alpheios-al-editor-languages-list-item__inactive': identData.hidden
  }
}

const toggleIdentDataVisibility = (identData) => {
  if (identFilteringAvailable.value || identData.hidden) {
    identData.hidden = !identData.hidden
    emit('updateVisibility', { identData, view: props.view })
  }
}
*/
</script>

<style lang="scss">
  .alpheios-al-editor-languages-list {
    // padding: 5px 10px;
  }

  .alpheios-al-editor-languages-list-item {
    display: inline-block;
    border: 1px solid #ddd;
    background: #fff;
    padding: 5px 10px;
    

    &.alpheios-al-editor-languages-list-item-clickable {
      cursor: pointer;
    }
  }

  .alpheios-icon-button {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    padding: 0 5px;
  }

  .alpheios-al-editor-languages-block-horizontal {
    .alpheios-al-editor-languages-list-item {
      display: block;
    }
  }
</style>
