import axios, { AxiosResponse } from 'axios';

class Client {
	IP: string;
	port: number;
	user: string;
	password: string;
	authcode: string;
	resources: { [key: string]: any };

	constructor() {
		this.IP = "146.59.4.27";
		this.port = 20201;
		this.user = 'discord2';
		this.password = "discord123";
		this.authcode = '5820174';
		this.resources = {};
		this.resources = this.createResourcesProxy();
	}

	private createResourcesProxy(): { [key: string]: any } {
		return new Proxy(this.resources, {
			get: (target, resourceName: string) => {
				return this.createProceduresProxy(resourceName);
			}
		});
	}

	private createProceduresProxy(resourceName: string): { [key: string]: (...args: any[]) => Promise<any> } {
		return new Proxy({}, {
			get: (target, procedureName: string) => {
				return (...args: any[]) => {
					return this.postMTA(resourceName, procedureName, ...args);
				};
			}
		});
	}

	private async postMTA(resourceName: string, procedureName: string, ...args: any[]): Promise<any> {
        resourceName = 'iq-discord'
		const url = `http://${this.IP}:${this.port}/${resourceName}/call/${procedureName}`;
		try {
			const response: AxiosResponse = await axios({
				method: 'POST',
				url: url,
				data: args,
				auth: {
					username: this.user,
					password: this.password + this.authcode
				}
			});
			const data = response.data;
			if (data.includes('error:')) {
				if (data.includes('not running'))
					return { error: true, errorType: 'resourceNotRunning' };
				if (data.includes('invalid function'))
					return { error: true, errorType: 'invalidFunctionName' };
				if (data.includes('not found'))
					return { error: true, errorType: 'functionNotFound' };
				return { error: true, errorType: data };
			}
			return data[0];
		} catch (error) {
			console.log(error);
			if (error.code === 'ECONNREFUSED') {
				return { error: true, errorType: 'serverOFF' };
			}
			if (error?.response?.status === 404) {
				return { error: true, errorType: 'resourceNotFound' };
			}
			return { error: true, errorType: 'unknownError' };
		}
	}
}

export = Client;
