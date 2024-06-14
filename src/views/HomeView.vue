<script lang="tsx">
import { defineComponent, Suspense } from 'vue'
import { YMWidget } from '@/modules/yandex-maps';

export default defineComponent({
  setup() {
    return () => (
      <div>
        <Suspense>
          <YMWidget />
        </Suspense>
      </div>
    )
  },
})
</script>