import { CreateIcon, ExploreIcon, HeartIcon, HomeIcon, InboxIcon, ReelsIcon, SearchIcon } from "@/components/Icons";

export const ROUTES = {
  HOME: {
    PATH: '/',
    NAME: 'Home',
    ICON: HomeIcon(),
    FOR: 'navbar'
  },
  SEARCH: {
    PATH: '/search',
    NAME: 'Search',
    ICON: SearchIcon(),
    FOR: 'navbar'
  },
  EXPLORE: {
    PATH: '/explore',
    NAME: 'Explore',
    ICON: ExploreIcon(),
    FOR: 'navbar'
  },
  REELS: {
    PATH: '/reels',
    NAME: 'Reels',
    ICON: ReelsIcon(),
    FOR: 'navbar'
  },
  INBOX: {
    PATH: '/inbox',
    NAME: 'Messages',
    ICON: InboxIcon(),
    FOR: 'navbar'
  },
  NOTIFICATION: {
    PATH: '/notifications',
    NAME: 'Notifications',
    ICON: HeartIcon(),
    FOR: 'navbar'
  },
  CREATE: {
    PATH: '/create',
    NAME: 'Create',
    ICON: CreateIcon(),
    FOR: 'navbar'
  },
  PROFILE: {
    PATH: '/profile',
    NAME: 'Profile',
    ICON: null,
    FOR: 'navbar'
  },
  LOGIN: {
    PATH: '/login',
    NAME: 'Login',
    ICON: null,
    FOR: 'auth'
  },
  SIGNUP: {
    PATH: '/signup',
    NAME: 'Signup',
    ICON: null,
    FOR: 'auth'
  },
  LOGOUT: {
    PATH: '/logout',
    NAME: 'Logout',
    ICON: null,
    FOR: 'auth'
  },
}




