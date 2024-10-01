import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer class="footer py-4  ">
        <div class="container-fluid">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-lg-6 mb-lg-0 mb-4">
              <div class="copyright text-center text-sm text-muted text-lg-start">
                © <script>
                  document.write(new Date().getFullYear())
                </script>,
                made with <i class="fa fa-heart"></i> by
                <a href="/" class="font-weight-bold" target="_blank">React theme</a>
                for a better web.
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
