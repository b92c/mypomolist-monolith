<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>My Pomolist</title>
    <link rel="shortcut icon" href="mypomolist.png" type="image/x-icon"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    @vite('resources/css/home.css')
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8160286030075996"
            crossorigin="anonymous"></script>

</head>

<body>
<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        {{--        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"--}}
        {{--                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">--}}
        {{--            <span class="navbar-toggler-icon"></span>--}}
        {{--        </button>--}}
        {{--        <div class="collapse navbar-collapse" id="navbarNav">--}}
        {{--            <ul class="navbar-nav ms-auto">--}}
        {{--                <li class="nav-item">--}}
        {{--                    <a class="nav-link" href="#">Login</a>--}}
        {{--                </li>--}}
        {{--                <li class="nav-item">--}}
        {{--                    <a class="nav-link" href="#">Register</a>--}}
        {{--                </li>--}}
        {{--            </ul>--}}
        {{--        </div>--}}
    </div>
</nav>

<!-- Cookie notice modal -->
<div class="modal" id="cookieNoticeModal" tabindex="-1" role="dialog" data-bs-theme="dark">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cookie Notice</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>This website uses cookies to enhance your experience. By continuing to browse, you agree to the use
                    of cookies.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="acceptCookies">Accept</button>
            </div>
        </div>
    </div>
</div>

<!-- Main content -->
<div class="container center">
    <div class="title">
        <h2>🍅<strong> My Pomolist </strong>🍅</h2>
        <br>
    </div>
    <div class="settings">
        <div class="break">
            <div class="description">⏱️ <br/>Break</div>
            <div class="value">
                <span class="control decrement-pause">-</span> <span class="v">5</span> <span
                    class="control increment-pause">+</span>
            </div>
        </div>
        <div class="session">
            <div class="description">⏱️ <br/>Pomodoro</div>
            <div class="value">
                <span class="control decrement-pomo">-</span> <span class="v">25</span> <span
                    class="control increment-pomo">+</span>
            </div>
        </div>
    </div>
    <div class="pomodoro">
        <div class="fill session"></div>
        <div class="fill break"></div>
        <div class="time-left"></div>
        <div class="status">Start</div>
        <div class="completed"></div>
        <div class="fullycycle"></div>
    </div>
    <div class="next-pomodoro">
        <span>Next</span>
    </div>
    <div class="reset-pomodoro">
        <span>Reset</span>
    </div>
</div>
<div class="container todo-list">
    <h2 class="todo-text">📝<strong> To-Do List </strong>📝</h2>
    <input type="text" id="newTask" class="form-control" placeholder="New task">
    <br/>
    <button type="button" id="addTask" class="btn btn-success mt-2">Add task</button>
    <ul id="taskList" class="list-group mt-3"></ul>
</div>

<div class="container">
    <section id="featuresSection" class="menu-section" style="display: none;">
        <h3><strong>Pomodoro Feature</strong></h3>
        <p>The Pomodoro Feature allows you to use the Pomodoro Technique to work on your tasks. The Pomodoro Technique
            is a time management method that uses a timer to break down work into intervals, usually 25 minutes long,
            separated by short breaks. Each interval is called a pomodoro, which means tomato in Italian.</p>

        <p>With our app, you can adjust the duration of the pomodoros and the breaks according to your preferences. You
            can also choose from different sounds and notifications to remind you when to start and stop working. 🍅</p>

        <br>

        <h3><strong>To-Do List Feature</strong></h3>
        <p>The To-Do List Feature allows you to create and manage your to-do list, with categories, priorities, and
            deadlines. You can add, edit, delete, and reorder your tasks easily. You can also mark your tasks as
            completed or incomplete, and see your progress. 📝</p>

        <p>With our app, you can store your to-do list in a cookie, so you don't lose your data when you close the app.
            You can also access your to-do list from any device, as long as you use the same browser. 🍪</p>

        <p>My Pomolist is more than just a timer and a to-do list. It is a powerful tool to help you achieve your goals,
            whether they are personal or professional, big or small. Download My Pomolist today and start your journey
            to a more productive and fulfilling life. 😊</p>
    </section>

    <section id="pricingSection" class="menu-section" style="display: none;">
        <h3><strong>Pricing</strong></h3>
        <p>My Pomolist is the app that combines the Pomodoro Technique and a To-Do List to help you achieve your goals.
            And the best part is: it's completely free! 😍</p>

        <p>You can download and use My Pomolist without paying anything, ever. No hidden fees, no ads, no subscriptions.
            Just a simple and powerful tool to help you work smarter, not harder. 💯</p>

        <p>We hope you enjoy My Pomolist and find it useful for your personal and professional projects. If you do,
            please share it with your friends and family, and help us spread the word. 🙏</p>

        <p>Thank you for choosing My Pomolist, and happy productivity! 😊</p>

    </section>

    <section id="aboutSection" class="menu-section" style="display: none;">
        <h3><strong>About</strong></h3>
        <p>Welcome to My Pomolist, the app that combines the Pomodoro Technique and a To-Do List to help you achieve
            your
            goals.
            In this presentation, we will show you what the Pomodoro Technique is, how it can benefit you,
            and how to use it with our app. </p>

        <br>

        <h4>What is the Pomodoro Technique? 🍅</h4>

        <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
            The technique uses a timer to break down work into intervals, usually 25 minutes long, separated by short
            breaks.
            Each interval is called a pomodoro, which means tomato in Italian, after the tomato-shaped kitchen timer
            that Cirillo used as a student.
            The purpose of the technique is to improve focus, reduce distractions, and avoid burnout. </p>

        <br>

        <h4>What are the benefits of using the Pomodoro Technique? 🙌</h4>

        <p>Some of the benefits of using the Pomodoro Technique are:</p>

        <ul>
            <li>- It helps you stay focused on one task at a time, without interruptions. 🎯</li>
            <li>- It helps you track your progress and estimate how much time you need for each task. ⏱️</li>
            <li>- It helps you avoid procrastination and overcome mental blocks. 💪</li>
            <li>- It helps you balance work and rest, and maintain a healthy rhythm. 🧘</li>
            <li>- It helps you boost your productivity and efficiency. 🚀</li>
        </ul>

        <br>

        <h4>How to use the Pomodoro Technique with our app? 📱</h4>

        <p>Our app, My Pomolist, is designed to help you apply the Pomodoro Technique to your daily tasks. With our app,
            you can:</p>

        <ul>
            <li>- Create and manage your to-do list, with categories, priorities, and deadlines. 📝</li>
            <li>- Set up your pomodoro timer, with customizable durations, sounds, and notifications. 🔔</li>
            <li>- Start working on your tasks, and follow the pomodoro cycle: work for 25 minutes, take a 5-minute
                break,
                and repeat. After four pomodoros, take a longer break of 15 to 30 minutes. 🔄
            </li>
            <li>- Review your performance, with statistics, graphs, and reports. 📊</li>
        </ul>

        <br>

        <p>My Pomolist is more than just a timer and a to-do list. It is a powerful tool to help you achieve your goals,
            whether they are personal or professional, big or small. Download My Pomolist today and start your journey
            to
            a more productive and fulfilling life. 😊</p>
    </section>
</div>

<!-- Footer -->
<div class="container">
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-2 border-top">
        <p class="col-md-4 mb-0 text-body-secondary footer-text">
            &copy; <a href="https://github.com/Bbarbosa7" target="_blank">Bbarbosa7</a>
        </p>

        <ul class="nav col-md-4 justify-content-end">
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary footer-text"
                                    id="homeLink">Home</a></li>
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary footer-text" id="featuresLink">Features</a>
            </li>
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary footer-text" id="pricingLink">Pricing</a>
            </li>
            <li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary footer-text"
                                    id="aboutLink">About</a></li>
        </ul>
    </footer>
</div>
@vite('resources/js/home.js')

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous">
</script>
</body>
</html>
