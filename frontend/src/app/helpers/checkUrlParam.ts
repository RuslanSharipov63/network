

export const checkUrlParam = (searchParam: string): boolean => {
    const currentUrl = window.location.href;
    const currentUrlArr = currentUrl.split("/");
    const checkInUrl = currentUrlArr.includes(searchParam)
    return checkInUrl;
}