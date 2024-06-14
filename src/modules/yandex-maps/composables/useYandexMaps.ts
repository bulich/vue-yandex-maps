export const useYandexMaps = (mapContainerId: string) => {
  let map: ymaps.Map | null = null

  const init = () => new Promise<ymaps.Map>((resolve, reject) => {
    try {
      ymaps.ready(() => {
        map = new ymaps.Map(mapContainerId, {
          center: [55.76, 37.64],
          zoom: 10,
        })
        resolve(map)
      })
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })

  const getCoordinates = async (address: string) => {
    if (!address) return null
    const geocoder = await ymaps.geocode(address)
    const result = geocoder.geoObjects.get(0)
    if (!result?.geometry) return null
    return result.geometry.getCoordinates()
  }

  const placeMark = (coordinates: number[]) => {
    if (!map) return
    map.geoObjects.add(new ymaps.Placemark(coordinates, {}))
    map.setBounds([[coordinates[0] - 0.01, coordinates[1] - 0.01], [coordinates[0] + 0.01, coordinates[1] + 0.01]])
  }

  const clearMap = () => {
    if (!map) return
    map.geoObjects.removeAll()
  }

  const buildRoute = (points: number[][], mode: "auto" | "pedestrian") => {
    if (!map) return

    const route = new ymaps.multiRouter.MultiRoute({
      referencePoints: points,
      params: { routingMode: mode },
    }, {
      boundsAutoApply: true,
    })

    map.geoObjects.add(route)
  }

  return {
    init,
    getCoordinates,
    placeMark,
    clearMap,
    buildRoute,
  }
}

export default useYandexMaps
