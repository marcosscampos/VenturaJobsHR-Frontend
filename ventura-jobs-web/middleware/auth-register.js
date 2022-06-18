export default async ({app, $httpClient, redirect}) => {
  $httpClient.$get("v1/users/user-token").then(res => {
    if (res == null || res == "") {
      redirect(`/${result.claims.role}/account/complete-registration`);
    }
  })
}
