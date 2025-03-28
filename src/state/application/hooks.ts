import {useCallback, useMemo} from 'react'
import {useDispatch} from 'react-redux'
import {AppState} from '../state'
import {useAppSelector} from '../hooks'
import {addPopup, PopupContent, removePopup} from './actions'


// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({content, key}))
    },
    [dispatch],
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({key}))
    },
    [dispatch],
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useAppSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
}

