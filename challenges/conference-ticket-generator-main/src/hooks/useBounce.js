export default function useBounce(target) {
  function bounce() {
    target.current?.classList.add('button--bounce')
  }

  function delBounce() {
    target.current?.classList.remove('button--bounce')
  }

  return [bounce, delBounce]
}
