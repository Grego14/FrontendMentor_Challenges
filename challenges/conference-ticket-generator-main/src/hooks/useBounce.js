export default function useBounce(target) {
  function bounce() {
    target.current && target.current.classList.add('button--bounce')
  }

  function delBounce() {
    target.current && target.current.classList.remove('button--bounce')
  }

  return [bounce, delBounce]
}
