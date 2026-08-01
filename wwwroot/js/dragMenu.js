window.dragMenuInterop = {
    init: function (buttonEl, overlayEl, dotNetRef) {
        let dragging = false;
        let startX = 0, startY = 0;
        let selectedLink = null;
        let wasOpenBeforeDown = false;
        const maxDistance = 40;
        let hasTeleported = false;

        function links() {
            return document.querySelectorAll('.menu-link');
        }

        function isOpen() {
            return overlayEl.style.display === 'flex';
        }

        function findClosest(x, y) {
            let closest = null;
            let closestDistance = Infinity;
            links().forEach(link => {
                const rect = link.getBoundingClientRect();
                const dx = Math.max(rect.left - x, 0, x - rect.right);
                const dy = Math.max(rect.top - y, 0, y - rect.bottom);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < closestDistance && distance < maxDistance) {
                    closestDistance = distance;
                    closest = link;
                }
            });
            return closest;
        }

        function onPointerDown(e) {
            wasOpenBeforeDown = isOpen();
            dragging = true;
            hasTeleported = false;
            startX = e.clientX;
            startY = e.clientY;
            selectedLink = null;
            overlayEl.style.display = 'flex';
            buttonEl.setPointerCapture(e.pointerId);
        }

        function onPointerMove(e) {
            if (!dragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (!hasTeleported) {
                if (distance < 10) return;
                hasTeleported = true;
                buttonEl.classList.add('dragging');
                buttonEl.style.position = 'fixed';
            }

            const rect = buttonEl.getBoundingClientRect();
            buttonEl.style.left = (e.clientX - rect.width / 2) + 'px';
            buttonEl.style.top = (e.clientY - rect.height / 2) + 'px';

            const closest = findClosest(e.clientX, e.clientY);
            if (closest !== selectedLink) {
                if (selectedLink) selectedLink.classList.remove('hovered');
                if (closest) closest.classList.add('hovered');
                selectedLink = closest;
            }
        }

        function onPointerUp(e) {
            if (!dragging) return;
            dragging = false;

            if (hasTeleported) {
                buttonEl.classList.remove('dragging');
                buttonEl.style.position = '';
                buttonEl.style.left = '';
                buttonEl.style.top = '';
            }

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const moved = Math.sqrt(dx * dx + dy * dy) > 10;

            if (selectedLink) {
                const route = selectedLink.dataset.route;
                selectedLink.classList.remove('hovered');
                overlayEl.style.display = 'none';
                dotNetRef.invokeMethodAsync('NavigateTo', route);
            } else if (!moved) {
                overlayEl.style.display = wasOpenBeforeDown ? 'none' : 'flex';
            } else {
                overlayEl.style.display = 'none';
            }

            selectedLink = null;
        }

        buttonEl.addEventListener('pointerdown', onPointerDown);
        buttonEl.addEventListener('pointermove', onPointerMove);
        buttonEl.addEventListener('pointerup', onPointerUp);
        buttonEl.addEventListener('pointercancel', onPointerUp);

        overlayEl.addEventListener('click', function (e) {
            if (e.target === overlayEl) {
                overlayEl.style.display = 'none';
            }
        });
    },

    close: function (overlayEl) {
        overlayEl.style.display = 'none';
    }
};