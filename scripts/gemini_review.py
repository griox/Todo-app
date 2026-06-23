#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
import urllib.error

def main():
    # Read environment variables and arguments
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    diff_file = "pr-diff.txt"
    shellcheck_file = "shellcheck-report.txt"
    output_file = "review-comment.txt"

    # Parse basic arguments if provided
    for arg in sys.argv[1:]:
        if arg.startswith("--diff-file="):
            diff_file = arg.split("=", 1)[1]
        elif arg.startswith("--shellcheck-file="):
            shellcheck_file = arg.split("=", 1)[1]
        elif arg.startswith("--output-file="):
            output_file = arg.split("=", 1)[1]

    # Read diff file
    diff_content = ""
    if os.path.exists(diff_file):
        try:
            with open(diff_file, "r", encoding="utf-8") as f:
                diff_content = f.read().strip()
        except Exception as e:
            print(f"Warning: Could not read diff file {diff_file}: {e}", file=sys.stderr)

    # Read shellcheck file
    shellcheck_content = ""
    if os.path.exists(shellcheck_file):
        try:
            with open(shellcheck_file, "r", encoding="utf-8") as f:
                shellcheck_content = f.read().strip()
        except Exception as e:
            print(f"Warning: Could not read shellcheck file {shellcheck_file}: {e}", file=sys.stderr)

    # If both diff and shellcheck outputs are empty, nothing to review
    if not diff_content and not shellcheck_content:
        comment_header = "## Hello World from AI-DevOps 🤖\n\n"
        comment_body = "No changes or shellcheck issues detected to review."
        try:
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(comment_header + comment_body)
            print(f"Written review comment to {output_file}")
            return
        except Exception as e:
            print(f"Error writing to output file: {e}", file=sys.stderr)
            sys.exit(1)

    # Construct prompt
    prompt = "You are a Senior DevOps and Software Engineer. Please perform a code review on the following Pull Request changes.\n"
    
    if shellcheck_content:
        prompt += "\n### Shellcheck Warnings/Errors:\n"
        prompt += "```\n" + shellcheck_content + "\n```\n"
        prompt += "Note: Please incorporate these Shellcheck issues in your review suggestions where relevant.\n"

    if diff_content:
        prompt += "\n### PR Git Diff:\n"
        prompt += "```diff\n" + diff_content + "\n```\n"

    prompt += (
        "\nInstructions for your review:\n"
        "1. Identify logic issues, security vulnerabilities, performance bugs, or styling issues.\n"
        "2. Provide constructive feedback and clear, actionable code suggestions where appropriate.\n"
        "3. Keep the comments concise, professional, and well-structured using markdown.\n"
        "4. Start directly with your review sections (do not add introductory greetings, as a header will be added automatically).\n"
    )

    # Call Gemini API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")

    try:
        print("Sending request to Gemini API (gemini-2.5-pro)...")
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            res_json = json.loads(res_data)
            
            # Extract content from response
            try:
                review_text = res_json['candidates'][0]['content']['parts'][0]['text']
            except (KeyError, IndexError) as parse_err:
                print(f"Error: Failed to parse API response structure: {parse_err}", file=sys.stderr)
                print(f"Response: {res_data}", file=sys.stderr)
                sys.exit(1)

            # Write final comment file
            comment_header = "## Hello World from AI-DevOps 🤖\n\n"
            try:
                with open(output_file, "w", encoding="utf-8") as f:
                    f.write(comment_header + review_text)
                print(f"Successfully generated review comment and wrote to {output_file}")
            except Exception as e:
                print(f"Error: Failed to write output file: {e}", file=sys.stderr)
                sys.exit(1)

    except urllib.error.HTTPError as e:
        print(f"HTTP Error calling Gemini API: {e.code} - {e.reason}", file=sys.stderr)
        try:
            error_body = e.read().decode("utf-8")
            print(f"Response body: {error_body}", file=sys.stderr)
        except Exception:
            pass
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Network Error calling Gemini API: {e.reason}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
