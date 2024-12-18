const capitalizeFirstLetter = (str: string): string => {
  if (str.length === 0) return str; // Handle empty string case
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const extractModelName = (content_type:string) => {
  if(content_type.startsWith("Api |")){
    const extractData = content_type.slice(5).trim()
    return capitalizeFirstLetter(extractData)
  }
}