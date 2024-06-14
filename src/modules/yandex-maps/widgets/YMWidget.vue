<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue'
import { DefaultInput, DefaultButton, RadioButton } from 'ark-component-ui'
import useYandexMaps from '../composables/useYandexMaps'

export default defineComponent({
  setup() {
    const addressValue = ref('')
    const searchResult = ref<number[]|null>(null)
    const routePoints = ref<number[][]>([])
    const routingMode = ref<'auto'|'pedestrian'>('auto')

    const {
      init,
      getCoordinates,
      placeMark,
      clearMap,
      buildRoute,
    } = useYandexMaps('map')

    const searchAddressCoordinates = async (address: string) => {
      searchResult.value = await getCoordinates(address)
    }

    const setResultMark = () => {
      if (!searchResult.value) return
      clearMap()
      placeMark(searchResult.value)
    }

    const addToRoute = () => {
      if (!searchResult.value) return
      routePoints.value.push(searchResult.value)
    }

    const removeFromRoute = (index: number) => {
      if (!routePoints.value.length) return
      routePoints.value.splice(index, 1)
    }

    const buildRouteonMap = () => {
      clearMap()
      buildRoute(routePoints.value, routingMode.value)
    }

    onMounted(async () => {
      await init()
    })

    return () => (
      <div class='ym-widget'>
        <DefaultInput
          style="margin-bottom: 20px;"
          modelValue={addressValue.value}
          onValueChange={(value) => searchAddressCoordinates(value)}
        />
        <div class='ym-widget-search'>
          <div>Результат поиска: {searchResult.value ? JSON.stringify(searchResult.value) : 'Ничего не найдено'}</div>
          <div class='ym-widget-search-controls'>
            <DefaultButton
              label='Показать на карте'
              onClick={setResultMark}
              isDisabled={!searchResult.value}
              size='S'
            />
            <DefaultButton
              label='Добавить в маршрут'
              onClick={() => addToRoute()}
              isDisabled={!searchResult.value}
              size='S'
            />
          </div>
        </div>
        <div class="ym-widget-map">
          <div id="map" style="width: 700px; height: 600px;"></div>
          <div class="ym-widget-routing">
            <h3>Маршрут:</h3>
            <div class="ym-widget-routes">
              {routePoints.value.map((item, i) => (
                <div class="ym-widget-route-item">
                  <div>{i+1}) {JSON.stringify(item)}</div>
                  <DefaultButton
                    icon='trash'
                    type='critical'
                    size='S'
                    onClick={() => removeFromRoute(i)}
                  />
                </div>
              ))}
            </div>
            <div style="margin: 20px 0;">
              <RadioButton
                modelValue={routingMode.value === 'auto'}
                onValueChange={() => routingMode.value = 'auto'}
                text='автомобильный'
              />
              <RadioButton
                style="margin-top: 8px;"
                modelValue={routingMode.value === 'pedestrian'}
                onValueChange={() => routingMode.value = 'pedestrian'}
                text='пешеходный'
              />
            </div>
            <DefaultButton
              label='Построить маршрут'
              onClick={buildRouteonMap}
              isDisabled={routePoints.value.length === 0}
              size='S'
            />
          </div>
        </div>
      </div>
    )
  },
})

</script>

<style lang="scss">
.ym-widget {
  &-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    &-controls {
      display: flex;
      gap: 16px;
    }
  }

  &-map {
    display: flex;
    gap: 20px;
  }

  &-routing {
    width: 280px;
  }

  &-routes {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-route-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color:azure;
    padding: 8px;
    border-radius: 4px;
  }
}
</style>