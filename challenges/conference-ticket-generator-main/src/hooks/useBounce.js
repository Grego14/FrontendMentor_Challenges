export default function useBounce(target) {
  function bounce() {
    target && target.classList.add('button--bounce')
  }

  function delBounce() {
    target && target.classList.remove('button--bounce')
  }

  return [bounce, delBounce]
}
