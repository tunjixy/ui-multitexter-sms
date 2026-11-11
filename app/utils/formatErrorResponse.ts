export default function (err: any): string {
  if (err.response) {
    return (
      err.response?._data?.msg ||
      err.response?._data ||
      err.response?._data?.error
    )
  } else if (err.name && err.name === 'NetworkError') {
    return 'Please check your internet connection'
  } else {
    return 'Something went wrong, try again later'
  }
}
