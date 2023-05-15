import {useContext} from 'react'
import {ScreenLayoutContext} from "@/contexts/screen-context";

export const useScreenLayout = () => useContext(ScreenLayoutContext)
