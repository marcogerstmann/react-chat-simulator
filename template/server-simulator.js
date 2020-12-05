var ChatServerInterface = function()
{
	if (this === window)
	{
		throw new Error();
	}

	var observers = [];

	var self = this;
	self.registerObserver = function(eventName, observer)
	{
		observers.push({ [eventName]: observer });
	};

	self.removeObserver = function(eventName, observer)
	{
		observers = observers.filter(function(o) {
			return o[eventName] !== observer;
		});
	};

	self.sendMessage = function(text)
	{
		notifyObservers('onMessage', 'Myself', text);
	};

	self.sendPrivateMessage = function(receiverName, text)
	{
		notifyObservers('onPrivateMessage', 'Myself', receiverName, text);
		window.setTimeout(
			function()
			{
				notifyObservers('onPrivateMessage', receiverName, 'Myself', getRandomText());
			},
			1000);

		if (Math.random() < 0.5)
		{
			window.setTimeout(
				function()
				{
					notifyObservers('onPrivateMessage', receiverName, 'Myself', getRandomText());
				},
				5000);
		}
	};

	self.requestProfileInformation = function(username, callback)
	{
		window.setTimeout(
			function()
			{
				var profileInfo = getRandomProfileInfo(username);
				callback(profileInfo);
			},
			200
		);
	}

	function notifyObservers(methodName)
	{
		var args = [];
		Array.prototype.push.apply(args, arguments);
		args.shift();

		observers.forEach(function(myObserver)
		{
			if (myObserver && myObserver[methodName])
			{
				try
				{
					myObserver[methodName].apply(null, args);
				}
				catch (e)
				{
					console.log('Error: '+e);
				}
			}
		});
	}

	function cronJob()
	{
		doRandom(0.30, function() { notifyObservers('onMessage', getRandomName(), getRandomText()); });
		doRandom(0.15, function() { notifyObservers('onPrivateMessage', getRandomName(), 'Myself', getRandomText()); });
		doRandom(0.20, function() { var name = getRandomName();
			notifyObservers('onUserJoined', name);
			notifyObservers('onMessage', name, oneOf('Hi!', 'Hallo', 'Wer da?', 'Huhu', 'Na ihr?')); });
		doRandom(0.80, function() { notifyObservers('onUserLeft', getRandomName()); });
	}

	function doRandom(prob, func)
	{
		if (Math.random() < prob)
		{
			try
			{
				func();
			}
			catch (e)
			{
				console.log(e);
			}
		}
	}

	function getRandomProfileInfo(username)
	{
		return {
			'username' : username,
			'age' : ((Math.random() * 50 + 14) & 0xFFFF),
			'gender' : oneOf('m', 'w', '?'),
			'town' : oneOf('Flensburg', 'Kiel', 'New York', 'Kleinsiehstemichnicht', 'Bielefeld'),
			'zipCode' : ((Math.random() * 80000 + 10000) & 0xFFFFF)
		};
	}

	function getRandomName()
	{
		return oneOf('Hans', 'Peter', 'Franz', 'James',
			'Anja', 'Susi', 'Juli', 'Maja', 'Michaela', 'Xena', 'Sheera',
			'Skeletor', 'Schlumpfine', 'Sauron', 'Rincewind', 'MissMarple')
			+ oneOf('', '17', '23', '2016', '', '45', '99', '', '', '', '<3');
	}

	function getRandomText()
	{
		var msg =
			getRandomName() + ' '
			+ oneOf('will', 'muss', 'kann', 'soll', 'darf') + ' '
			+ oneOf('mit', 'ohne', 'neben') + ' '
			+ getRandomName() + ' '
			+ oneOf('putzen', 'tanzen', 'rappen', 'fernsehgucken', 'einschlafen', 'wachbleiben', 'singen', 'Unkraut zupfen', 'durchbrennen', 'lesen', 'chillen', 'joggen', 'fallschirmspringen', 'tauchen', 'segeln');

		if (Math.random() < 0.5)
		{
			msg += ' '
				+ oneOf('und', 'oder', 'und vielleicht', 'und nicht') + ' '
				+ oneOf('mit', 'ohne', 'neben') + ' '
				+ getRandomName() + ' '
				+ oneOf('weitermachen', 'was anderes machen', 'Ziegen streicheln', 'stricken', 'fechten', 'streiten', 'saufen', 'Pferde stehlen', 'Banken ausrauben', 'nicht leben');
		}

		return msg + '. ' + oneOf('', '', '', ':)', ':-(', ':-P', ':-D', '8-)', '');
	}

	function oneOf()
	{
		return arguments[(arguments.length * Math.random()) & 0xFFFF];
	}


	window.setInterval(cronJob, 750);
};

window.serverInterface = new ChatServerInterface();
