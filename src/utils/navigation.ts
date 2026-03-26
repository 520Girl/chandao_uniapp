export const navigateTo = (screen: string, params?: any) => {
  const tabBarPages = ['home', 'community', 'profile','meditation'];
  
  if (tabBarPages.includes(screen)) {
    uni.switchTab({
      url: `/pages/${screen}/index`
    });
  } else {
    let url = `/pages/${screen}/index`;
    if (params) {
      const query = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      url += `?${query}`;
    }
    uni.navigateTo({
      url
    });
  }
};

export const navigateBack = () => {
  uni.navigateBack();
};
