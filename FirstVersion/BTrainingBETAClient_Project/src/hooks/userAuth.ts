import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/services/UserService"

export const userAuth = () => {
    const { data , isLoading, isError} = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
        refetchOnWindowFocus: false
    })

    return{ data, isLoading, isError}
}