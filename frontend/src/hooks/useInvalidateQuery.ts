import { api } from "@/api/client";
import { useQueryClient } from "@tanstack/react-query";


function useInvalidateQuery() {
    const queryClient = useQueryClient();
    
    function invalidateMeQueries() {
        queryClient.invalidateQueries({
            queryKey: api.user.readCurrentUserApiV1UserMeGet.getQueryKey()
        });
    }

    function invalidateUserImages() {
        queryClient.invalidateQueries({
            queryKey: api.user.getUserImagesApiV1UserImagesGet.getQueryKey()
        });
    }

    // refetch me queries
    function refetchMeQueries() {
        queryClient.refetchQueries({
            queryKey: api.user.readCurrentUserApiV1UserMeGet.getQueryKey()
        });
    }
    
    return { invalidateMeQueries, invalidateUserImages, refetchMeQueries };
}

export { useInvalidateQuery };
