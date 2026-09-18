(function () {
  function showStatus(form, text, ok) {
    var msg = form.querySelector('.newsletter-status');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'newsletter-status';
      msg.style.cssText = 'font-size:.85rem;margin:0;';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = ok ? '#5B6B4F' : '#c0392b';
    msg.style.display = 'block';
  }

  var forms = document.querySelectorAll('.newsletter');
  for (var i = 0; i < forms.length; i++) {
    (function (form) {
      var input = form.querySelector('input[type="email"]');
      var btn = form.querySelector('.btn');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var email = (input ? input.value : '').trim();
        if (!email) {
          showStatus(form, 'Please enter your email address.');
          return;
        }

        if (btn) btn.disabled = true;

        fetch('/.netlify/functions/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            return res.json();
          })
          .then(function () {
            if (input) input.value = '';
            showStatus(form, 'Thank you! You are subscribed.', true);
          })
          .catch(function () {
            showStatus(form, 'Something went wrong. Please try again.');
          })
          .finally(function () {
            if (btn) btn.disabled = false;
          });
      });
    })(forms[i]);
  }
})();