import { BASE_URL } from './constant.ts'

/* получить все услуги */
export const getServices = async () => {
    try {
        const reposne = await fetch(`${BASE_URL}/api/admin/getServices`);
        const data = await reposne.json();
        return data;

    } catch (error) {
        console.log('Админ. Ошибка сервера', error);
        return { success: false, message: "Ошибка выборки. Админ" }
    }
}

/* получить услугу по id */

export const getServiceId = async (id) => {
    try {
        const reposne = await fetch(`${BASE_URL}/api/admin/getservice`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 'id': id })
        });
        const data = await reposne.json();
        return data;

    } catch (error) {
        console.log('Админ. Ошибка сервера', error);
        return { success: false, message: "Ошибка выборки услуши по id. Админ" }
    }
}

/* изменить статус услуги */

export const changeStatusServiceByIdAdmin = async (dataService) => {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/changestatus`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataService)
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Ошибка изменения статуса:", error)
        return { success: false, message: "Ошибка изменения статуса сервиса" }
    }
}

